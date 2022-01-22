function ProcessName() {
    var openPtr = Module.getExportByName('libc.so', 'open');
    var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
    var readPtr = Module.getExportByName('libc.so', 'read');
    var read = new NativeFunction(readPtr, 'int', ['int', 'pointer', 'int']);
    var closePtr = Module.getExportByName('libc.so', 'close');
    var close = new NativeFunction(closePtr, 'int', ['int']);
    var path = Memory.allocUtf8String('/proc/self/cmdline');
    var fd = open(path, 0);
    if (fd != -1) {
        var buffer = Memory.alloc(0x1000);
        var result = read(fd, buffer, 0x1000);
        close(fd);
        result = ptr(buffer).readCString();
        return result;
    }
    return -1;
}

function dump_dex() {
    var Pro = ProcessName();
    var libart = Process.findModuleByName("libart.so");
    var addr_DefineClass = null;
    var symbols = libart.enumerateSymbols();
    for (var index = 0; index < symbols.length; index++) 
    {
        var symbol = symbols[index];
        var symbol_name = symbol.name;
         if (symbol_name.indexOf("ClassLinker") >= 0 && 
            symbol_name.indexOf("DefineClass") >= 0 && 
            symbol_name.indexOf("Thread") >= 0 && 
            symbol_name.indexOf("DexFile") >= 0 ) {
            console.log(symbol_name, symbol.address);
            addr_DefineClass = symbol.address;
        }
    }
    var dex_maps = {};
    var dex_count = 1;
    console.error("[DefineClass] : ", addr_DefineClass);
    if (addr_DefineClass) {     
        Interceptor.attach(addr_DefineClass, {
            onEnter: function(args) {            
                var dex_file = args[5];
                var base = ptr(dex_file).add(Process.pointerSize).readPointer();
                var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();
                if (dex_maps[base] == undefined) {                 
                    dex_maps[base] = size;
                    var magic = ptr(base).readCString();
                    if (magic.indexOf("dex") == 0) {                                         
                            var dex_dir_path = "/data/data/"+Pro+"/" ;                        
                            var dex_path = dex_dir_path + (dex_count == 1 ? "1" : dex_count) +"_"+size+ ".dex";                       
                            var fd = new File(dex_path, "wb");
                            if (fd && fd != null) 
                              {
                           // if(size!="10244272" && size!="5263788" && size!="148644" && size!="311160" && size!="7368444" && size!="7491848" && size!="8190552" && size!="9519584" && size!="336652" && size!="10159140" && size!="4947360" && size!="404596" && size !="431528" && size!="260136" && size!="136128" && size!="409152" && size!="7796165" && size!="7111612" && size!="8503040" && size!="8222224" && size!="6862528")
                              {  
                                dex_count++;
                                var dex_buffer = ptr(base).readByteArray(size);
                                fd.write(dex_buffer);
                                fd.flush();
                                fd.close();
                                console.warn("[Dump Dex]:", dex_path);
                               }
                            }
                       }                    
                }
            },
            onLeave: function(retval) {}
        });
    }
}
var is_hook_libart = false;
function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "dlopen"), {
        onEnter: function(args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = ptr(pathptr).readCString();
                console.log("dlopen:", path);
                if (path.indexOf("libart.so") >= 0) {
                    this.can_hook_libart = true;
                    console.log("[dlopen:]", path);
                }
            }
        },
        onLeave: function(retval) {
            if (this.can_hook_libart && !is_hook_libart) {
                dump_dex();
                is_hook_libart = true;
            }
        }
    })
Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
        onEnter: function(args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = ptr(pathptr).readCString();
                console.log("android_dlopen_ext:", path);
                if (path.indexOf("libart.so") >= 0) {
                    this.can_hook_libart = true;
                    console.log("[android_dlopen_ext:]", path);
                }
            }
        },
        onLeave: function(retval) {
            if (this.can_hook_libart && !is_hook_libart) {
                dump_dex();
                is_hook_libart = true;
            }
        }
    });
}
setImmediate(dump_dex);
