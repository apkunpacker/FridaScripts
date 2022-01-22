Java.perform(function () {
    console.warn("Enumerate ALL Native Libs Exports - started")
    const ActivityThread = Java.use('android.app.ActivityThread');
    const file = Java.use("java.io.File");

    var targetApp = ActivityThread.currentApplication();
    var context = targetApp.getApplicationContext();
    var libFolder = context.getFilesDir().getParent() + "/lib"

    var currentPath = file.$new(libFolder);
    var nativelibs = currentPath.listFiles();

    nativelibs.forEach(function (f) {
        var libName = f.getName()
        console.warn("Native lib name: " + libName)
 
        var exports = Module.enumerateExportsSync(libName)
        console.warn("Exported methods:")
        if (exports === undefined || exports.length == 0) {
            console.warn("No exported methods for " + libName)
        }

        for (var i = 0; i < exports.length; i++) {
            var current_export = {
                name: exports[i].name,
                address: exports[i].address
            };
            console.warn(JSON.stringify(current_export, null, 1))
        }

    });
    console.warn("Enumerate ALL Native Libs Exports - completed")
});