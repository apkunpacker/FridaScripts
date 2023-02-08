setTimeout(function() {
    Interceptor.attach(Module.findExportByName("ProtectionPlusDLL.dll", "IsSubscriptionLicense"), {
        onLeave: function(retval) {
            retval.replace(1);
        }
    })
    Interceptor.attach(Module.findExportByName("ProtectionPlusDLL.dll", "IsInitializedSoftwareKey"), {
        onLeave: function(retval) {
            retval.replace(1);
        }
    })
}, 1000);
