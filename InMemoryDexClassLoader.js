/*
Created By @Cryptax & Modified By @ApkUnpacker
*/
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
var ProcessN = ProcessName();
try {
    Java.performNow(function() {
        console.log("Running In Java.performNow().....");
        var memoryclassLoader = Java.use('dalvik.system.InMemoryDexClassLoader');
        memoryclassLoader.$init.overload('java.nio.ByteBuffer', 'java.lang.ClassLoader').implementation = function(dexbuffer, loader) {
            var object = this.$init(dexbuffer, loader);
            var remaining = dexbuffer.remaining();
            var theDate = new Date();
            var hour = theDate.getHours();
            var minute = theDate.getMinutes();
            var second = theDate.getSeconds();
            var mSecond = theDate.getMilliseconds()
            hour < 10 ? hour = '0' + hour : hour;
            minute < 10 ? minute = '0' + minute : minute;
            second < 10 ? second = '0' + second : second;
            mSecond < 10 ? mSecond = '00' + mSecond : mSecond < 100 ? mSecond = '0' + mSecond : mSecond;
            var time = hour + '.' + minute + '.' + second + '.' + mSecond;
            const filename = '/data/data/' + ProcessN + '/' + time + '_dump.dex';
            console.warn('[*] Opening file name=' + filename + ' to write ' + remaining + ' bytes');
            const f = new File(filename, 'wb');
            var buf = new Uint8Array(remaining);
            for (var i = 0; i < remaining; i++) {
                buf[i] = dexbuffer.get();             
            }
            console.log('[*] Writing ' + remaining + ' bytes...');
            f.write(buf);
            f.close();
            remaining = dexbuffer.remaining();
            if (remaining > 0) {
                console.log('[-] Error: There are ' + remaining + ' remaining bytes!');
            } else {
                console.log('[+] Dex dumped successfully in  ' + filename);
            }
            return object;
        }
    });
} catch (error) {
    console.error("Error in PerformNow : ", error);
}

try {
    Java.perform(function() {
        console.log("Running In Java.perform().....");
        var memoryclassLoader = Java.use('dalvik.system.InMemoryDexClassLoader');
        memoryclassLoader.$init.overload('java.nio.ByteBuffer', 'java.lang.ClassLoader').implementation = function(dexbuffer, loader) {
            var object = this.$init(dexbuffer, loader);
            var remaining = dexbuffer.remaining();
            var theDate = new Date();
            var hour = theDate.getHours();
            var minute = theDate.getMinutes();
            var second = theDate.getSeconds();
            var mSecond = theDate.getMilliseconds()
            hour < 10 ? hour = '0' + hour : hour;
            minute < 10 ? minute = '0' + minute : minute;
            second < 10 ? second = '0' + second : second;
            mSecond < 10 ? mSecond = '00' + mSecond : mSecond < 100 ? mSecond = '0' + mSecond : mSecond;
            var time = hour + '.' + minute + '.' + second + '.' + mSecond;
            const filename = '/data/data/' + ProcessN + '/' + time + '_dump.dex';
            console.warn('[*] Opening file name=' + filename + ' to write ' + remaining + ' bytes');
            const f = new File(filename, 'wb');
            var buf = new Uint8Array(remaining);
            for (var i = 0; i < remaining; i++) {
                buf[i] = dexbuffer.get();               
            }
            console.log('[*] Writing ' + remaining + ' bytes...');
            f.write(buf);
            f.close();
            remaining = dexbuffer.remaining();
            if (remaining > 0) {
                console.log('[-] Error: There are ' + remaining + ' remaining bytes!');
            } else {
                console.log('[+] Dex dumped successfully in 2 ' + filename);
            }
            return object;
        }
    });
} catch (error) {
    console.error("Error in Perform : ", error);
}
