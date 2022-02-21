var Location = "libdexprotector.";
var FileLoaded = 0;
var gpid = Get();
var Pro = ProcessName();

function Get() {
    var getpd = new NativeFunction(Module.findExportByName("libc.so", "getpid"), 'int', []);
    return getpd();
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
Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
    onEnter: function(args) {
        var library_path = Memory.readCString(args[0])
        if (library_path.indexOf(Location) >= 0) {
            console.warn("Loading library : " + library_path)
            FileLoaded = 1;
        }
    },
    onLeave: function(retVal) {
        if (FileLoaded == 1) {
            var LibName = Location + gpid + ".so";
            var libso = Process.findModuleByName(LibName);
            var theDate = new Date();
            var hour = theDate.getHours();
            var minute = theDate.getMinutes();
            var second = theDate.getSeconds();
            var mSecond = theDate.getMilliseconds()
            hour < 10 ? hour = "0" + hour : hour;
            minute < 10 ? minute = "0" + minute : minute;
            second < 10 ? second = "0" + second : second;
            mSecond < 10 ? mSecond = "00" + mSecond : mSecond < 100 ? mSecond = "0" + mSecond : mSecond;
            var time = hour + ":" + minute + ":" + second + ":" + mSecond;
            console.log("[name]:", libso.name);
            console.log("[base]:", libso.base);
            console.log("[size]:", ptr(libso.size));
            console.log("[path]:", libso.path);
            var file_path = "/data/data/" + Pro + "/" + libso.name + "_" + libso.base + "_" + ptr(libso.size) + time + ".so";
            var file_handle = new File(file_path, "wb");
            if (file_handle && file_handle != null) {
                Memory.protect(ptr(libso.base), libso.size, 'rwx');
                var libso_buffer = ptr(libso.base).readByteArray(libso.size);
                file_handle.write(libso_buffer);
                file_handle.flush();
                file_handle.close();
                console.log("[dump]:", file_path);
            }
        }
    }
})