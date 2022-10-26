const fork_ptr = Module.getExportByName(null, "fork");
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(fork_ptr, new NativeCallback(function() {
    console.warn("Fork Found and Replaced");
    return -1;
}, "int", []));
var Color = {
    RESET: "\x1b[39;49;00m",
    Black: "0;01",
    Blue: "4;01",
    Cyan: "6;01",
    Gray: "7;11",
    Green: "2;01",
    Purple: "5;01",
    Red: "1;01",
    Yellow: "3;01",
    Light: {
        Black: "0;11",
        Blue: "4;11",
        Cyan: "6;11",
        Gray: "7;01",
        Green: "2;11",
        Purple: "5;11",
        Red: "1;11",
        Yellow: "3;11"
    }
};
var LOG = function(input, kwargs) {
    kwargs = kwargs || {};
    var logLevel = kwargs['l'] || 'log',
        colorPrefix = '\x1b[3',
        colorSuffix = 'm';
    if (typeof input === 'object')
        input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
    if (kwargs['c'])
        input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
    console[logLevel](input);
};

function Blue(str) {
    LOG(str, {
        c: Color.Blue
    });
}

function Green(str) {
    LOG(str, {
        c: Color.Green
    });
}

function Purple(str) {
    LOG(str, {
        c: Color.Purple
    });
}

function Red(str) {
    LOG(str, {
        c: Color.Red
    });
}

function Yellow(str) {
    LOG(str, {
        c: Color.Yellow
    });
}

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

function HeaderInfo(Buf, C) {
    var ApkUnpacker = new Uint8Array(Buf);
    var Count = C - 1;
    if (ApkUnpacker[0] == 99 && ApkUnpacker[1] == 100 && ApkUnpacker[2] == 101 && ApkUnpacker[3] == 120 && ApkUnpacker[4] == 48 && ApkUnpacker[5] == 48 && ApkUnpacker[6] == 49) {
        Green("[*] cdex001 Header Detected. Probably classes" + Count + ".dex is Not A Valid Dex");
        return 1;
    } else
    if (ApkUnpacker[0] == 0 && ApkUnpacker[1] == 0 && ApkUnpacker[2] == 0 && ApkUnpacker[3] == 0 && ApkUnpacker[4] == 0 && ApkUnpacker[5] == 0 && ApkUnpacker[6] == 0) {
        Green("[*] 0000000 Header Detected. Probably classes" + Count + ".dex is Dexprotector Loaded Dex. Repair it Manually");
        return 2;
    } else
    if (ApkUnpacker[0] == 0 || ApkUnpacker[0] != 100) {
        Green("[*] Wiped Header Detected , Repair classes" + Count + ".dex Manually.This May Be Interesting Dex");
        return 3;
    } else {
        return 0;
    }
}

function dump_dex() {
    var Pro = ProcessName();
    var libart = Process.findModuleByName("libart.so");
    var addr_DefineClass = null;
    var symbols = libart.enumerateSymbols();
    for (var index = 0; index < symbols.length; index++) {
        var symbol = symbols[index];
        var symbol_name = symbol.name;
        if (symbol_name.indexOf("ClassLinker") >= 0 &&
            symbol_name.indexOf("DefineClass") >= 0 &&
            symbol_name.indexOf("Thread") >= 0 &&
            symbol_name.indexOf("DexFile") >= 0) {
            addr_DefineClass = symbol.address;
            Purple("Symbol Found : Lets Do The Work");
        }
    }
    var dex_maps = {};
    var dex_count = 1;
    if (addr_DefineClass) {
        Interceptor.attach(addr_DefineClass, {
            onEnter: function(args) {
                var dex_file = args[5];
                var base = ptr(dex_file).add(Process.pointerSize).readPointer();
                var size = ptr(dex_file).add(Process.pointerSize + Process.pointerSize).readUInt();
                if (dex_maps[base] == undefined) {
                    dex_maps[base] = size;
                    var dex_dir_path = "/data/data/" + Pro + "/";
                    //  var dex_dir_path = "/data/data/com.your.apk/";                   
                    var dex_path = dex_dir_path + "classes" + dex_count + ".dex";
                    var fd = new File(dex_path, "wb");
                    if (fd && fd != null) {
                        dex_count++;
                        var dex_buffer = ptr(base).readByteArray(size);
                        var Checks = HeaderInfo(dex_buffer, dex_count);
                        fd.write(dex_buffer)
                        fd.flush();
                        fd.close();
                        if (Checks == 1) {
                            Purple("[Dex] :" + dex_path);
                        } else
                        if (Checks == 2) {
                            Purple("[Dex] :" + dex_path);
                        } else
                        if (Checks == 3) {
                            Purple("[Dex] :" + dex_path);
                        } else {
                            console.log("[Dex] :", dex_path);
                        }
                    }
                }
            },
            onLeave: function(retval) {}
        });
    }
}
setImmediate(dump_dex);
