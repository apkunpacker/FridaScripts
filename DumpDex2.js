const ForkPtr = Module.getExportByName(null, "fork");
const Fork = new NativeFunction(ForkPtr, 'int', []);
Interceptor.replace(ForkPtr, new NativeCallback(function() {
  console.warn("Fork Found and Replaced");
  return -1;
}, "int", []));

function ProcessName() {
  let openPtr = Module.getExportByName('libc.so', 'open');
  let open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
  let readPtr = Module.getExportByName('libc.so', 'read');
  let read = new NativeFunction(readPtr, 'int', ['int', 'pointer', 'int']);
  let closePtr = Module.getExportByName('libc.so', 'close');
  let close = new NativeFunction(closePtr, 'int', ['int']);
  let path = Memory.allocUtf8String('/proc/self/cmdline');
  let fd = open(path, 0);
  if (fd != -1) {
    let buffer = Memory.alloc(0x1000);
    let result = read(fd, buffer, 0x1000);
    close(fd);
    result = ptr(buffer)
      .readCString();
    return result;
  }
  return -1;
}

function Dump_Dex() {
  let Pro = ProcessName();
  let libart = Process.findModuleByName("libart.so");
  let addr_DefineClass = null;
  let symbols = libart.enumerateSymbols();
  for (let index = 0; index < symbols.length; index++) {
    let symbol = symbols[index];
    if (symbol.name.indexOf("ClassLinker") >= 0 && symbol.name.indexOf("DefineClass") >= 0 && symbol.name.indexOf("Thread") >= 0 && symbol.name.indexOf("DexFile") >= 0) {
      addr_DefineClass = symbol.address;
    }
  }
  let dex_maps = {};
  let dex_count = 1;
  if (addr_DefineClass) {
    Interceptor.attach(addr_DefineClass, {
      onEnter: function(args) {
        let dex_file = args[5];
        let base = ptr(dex_file).add(Process.pointerSize).readPointer();
        let size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();
        if (dex_maps[base] == undefined) {
          dex_maps[base] = size;
          let dex_dir_path = "/data/data/" + Pro + "/";
          let dex_path = dex_dir_path + "classes" + dex_count + ".dex";
          dex_count++;
          let count_dex = dex_count;
          let count = count_dex - 1;
          let dex_buffer = ptr(base).readByteArray(size);
          let DexFD = new File(dex_path, "wb");
          DexFD.write(dex_buffer)
          DexFD.flush();
          DexFD.close();
          console.log("[Dex" + count + "] : " + dex_path);
        }
      },
      onLeave: function(retval) {}
    });
  }
}
setImmediate(Dump_Dex);
