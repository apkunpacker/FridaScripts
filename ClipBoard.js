setTimeout(function() {
    Java.perform(function() {
        Java.choose("android.content.ClipboardManager", {
            onMatch: function(instance) {               
                if (instance.toString().indexOf("android.content.ClipboardManager") >= 0) {
                    var ActivityThread = Java.use('android.app.ActivityThread');
                    var context = ActivityThread.currentApplication().getApplicationContext();
                    var ClipboardManager = Java.use("android.content.ClipboardManager");
                    var clipboardHandle = context.getSystemService("clipboard");
                    var cp = Java.cast(clipboardHandle, ClipboardManager);
                    var primaryClip = cp.getPrimaryClip();
                    if (primaryClip != null) {
                        console.log(primaryClip.toString());
                    }
                }
            },
            onComplete: function() {}

        });
    })

}, 1000)
