setTimeout(function() { 
        var IDB = Process.findModuleByName("Register.dll");
        Module.enumerateExportsSync(IDB.name).forEach(function (exp) {
         /*We can also use single export name but this way is mor easy if we have to deal with more exports . Remove // from console.log lines if want to see input perameter and return value*/   
       if ((exp.name).indexOf('CheckLicenseLocatin')  != -1) {
          try {
               Interceptor.attach(ptr(exp.address), {
                     onEnter: function (args) {
                           //console.log(exp.name + " argument : "+ args[0]);
                        },
                      onLeave: function(retval)  {         
                            // console.warn(exp.name + " [ Retval ] : "+retval);
                            // console.warn("We are registered now");
							 retval.replace(3);
                            /* retval 1= Activated 365 days , 2=Giveaway 365 days , 3 =Lifetime never expire , 4 = Trial 
                    Tested With Version 7.2 */
                             
                     }
            });
        } catch (e) { } 
       }
    });
    }, 1000);