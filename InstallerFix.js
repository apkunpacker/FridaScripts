​console.log("[*] Helper Script For Installer Name Fixing.............");
Java.perform(function() {
        var Installer = Java.use("android.app.ApplicationPackageManager");
        Installer.getInstallerPackageName.overload('java.lang.String').implementation = function(Str) {
            console.log("Original Call : " + Str.toString())
            console.log("[Fixed]. Package Is Installed From Play Store ");
            return "com.android.vending";
        }
    })
