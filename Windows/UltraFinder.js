setTimeout(function() { 
        var UF = Process.findModuleByName("ProtectionPlusDLL.dll");
        Module.enumerateExportsSync(UF.name).forEach(function (exp) {
         /*We can also use single export name but this way is mor easy if we have to deal with more exports . Remove // from console.log lines if want to see input perameter and return value*/   
       if ((exp.name).indexOf('IsSubscriptionLicense') || (exp.name).indexOf("IsInitializedSoftwareKey")!= -1) {
          try {
               Interceptor.attach(ptr(exp.address), {
                     onEnter: function (args) {
                           //console.log(exp.name + " argument : "+ args[0]);
                        },
                      onLeave: function(retval)  {         
                             //console.warn(exp.name + " [ Retval ] : "+retval);
                            // console.warn("We are registered now");
							 retval.replace(1);
                             
                     }
            });
        } catch (e) { } 
        }
    });
    }, 1000);