var targetLibrary = "libname.so";

function getProcessName() {
    const libc = Process.getModuleByName('libc.so')
    var openPtr = libc.getExportByName('open')
    var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
    var readPtr = libc.getExportByName('read');
    var read = new NativeFunction(readPtr, 'int', ['int', 'pointer', 'int']);
    var closePtr = libc.getExportByName('close');
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
Interceptor.attach(Module.getGlobalExportByName('android_dlopen_ext'), {
    onEnter: function(args) {
        var library_path = args[0].readCString();
        if (library_path.indexOf(targetLibrary) >= 0) {
            console.warn("Loading library : " + library_path)
            this.isTargetLibraryLoaded = true;
        }
    },
    onLeave: function(retval) {
        if (this.isTargetLibraryLoaded) {
            var processName = getProcessName();
            var libraryModule = Process.findModuleByName(targetLibrary);
            console.log("[name]:", libraryModule.name);
            console.log("[base]:", libraryModule.base);
            console.log("[size]:", ptr(libraryModule.size));
            console.log("[path]:", libraryModule.path);
            var outputFilePath = "/data/data/" + processName + "/" + libraryModule.name + "_" + libraryModule.base + "_" + ptr(libraryModule.size) + ".so";
            var outputFile = new File(outputFilePath, "wb");
            if (outputFile && outputFile != null) {
                Memory.protect(ptr(libraryModule.base), libraryModule.size, 'rwx');
                var libraryBuffer = ptr(libraryModule.base).readByteArray(libraryModule.size);
                outputFile.write(libraryBuffer);
                outputFile.flush();
                outputFile.close();
                console.log("[dump]:", outputFilePath);
            }
        }
    }
})
