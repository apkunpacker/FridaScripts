/*
Fork hook needed in case process spawn child process
which causes frida to terminate. Return -1 only when you feel need of it.
*/

/*
const fork_ptr = Module.getExportByName(null, "fork");
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(fork_ptr, new NativeCallback(function() {
    console.warn("Fork Found and Replaced");
    return fork()
    //return -1;
}, "int", []));
*/

// Enter your package name here as getting process name on higher android version is tricky

let Pro = "com.app.name"

function ProcessDex(Buf, C,Path) {
    let ApkUnpacker = new Uint8Array(Buf);
    let Count = C - 1;
    if (ApkUnpacker[0] == 99 && ApkUnpacker[1] == 100 && ApkUnpacker[2] == 101 && ApkUnpacker[3] == 120 && ApkUnpacker[4] == 48 && ApkUnpacker[5] == 48 && ApkUnpacker[6] == 49) {
        console.warn("[*]  classes" + Count + ".dex is CDex. Ignore It.");       
    } else
    if (ApkUnpacker[0] == 0 && ApkUnpacker[1] == 0 && ApkUnpacker[2] == 0 && ApkUnpacker[3] == 0 && ApkUnpacker[4] == 0 && ApkUnpacker[5] == 0 && ApkUnpacker[6] == 0) {
        console.warn("[*] 0000000 Header. Probably classes" + Count + ".dex is Dexprotector's Dex.");
        console.error("[Dex"+Count +"] : "+Path);
        WriteDex(Count,Buf,Path,0);        
    } else
    if (ApkUnpacker[0] == 0 || ApkUnpacker[0] != 100) {
        console.warn("[*] Wiped Header , classes" + Count + ".dex is Interesting Dex.");
        console.error("[Dex"+Count +"] : "+Path);      
        WriteDex(Count,Buf,Path,0);
    } else {
        WriteDex(Count,Buf,Path,1);
    }
}
function WriteDex(Count,Buffer,Path,Flag) {   
   let DexFD = new File(Path, "wb");
   DexFD.write(Buffer)
   DexFD.flush();
   DexFD.close();
   if(Flag == 0){
      console.warn("[Dex"+Count +"] : "+Path);
   } else {
     console.log("[Dex"+Count +"] : "+Path);
   }
}

function Dump_Dex() {
    let libart = Process.findModuleByName("libart.so");
    let addr_DefineClass = null;
    let symbols = libart.enumerateSymbols();
    for (let index = 0; index < symbols.length; index++) {
        let symbol = symbols[index];
        let symbol_name = symbol.name;
        if (symbol_name.indexOf("ClassLinker") >= 0 && symbol_name.indexOf("DefineClass") >= 0 && symbol_name.indexOf("Thread") >= 0 && symbol_name.indexOf("DexFile") >= 0) {
            addr_DefineClass = symbol.address;
            console.log("Symbol Found : Lets Do The Dumping");
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
                    let count = count_dex -1;
                    let dex_buffer = ptr(base).readByteArray(size);
                    ProcessDex(dex_buffer, dex_count,dex_path);
                }
            },
            onLeave: function(retval) {}
        });
    }
}
setImmediate(Dump_Dex);
