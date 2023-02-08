setTimeout(function() {
    Interceptor.attach(Module.findExportByName("ProtectionPlusDLL.dll", "IsActivatedSoftwareKey"), {
        onLeave: function(retval) {
            retval.replace(1);
        }
    })
}, 1000);
