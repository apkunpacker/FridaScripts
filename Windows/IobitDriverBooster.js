setTimeout(function() {
    Interceptor.attach(Module.findExportByName("Register.dll", "CheckLicenseLocatin"), {
        onLeave: function(retval) {
            retval.replace(3);
            /* retval 1= Activated 365 days ; 2=Giveaway 365 Days , 3 =Lifetime Never Expire , 4 = Trial 
               Tested With Version 7.2 
            */
        }
    })
}, 1000);
