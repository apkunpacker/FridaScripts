var Location = "libEpic_Vm.so";
var FileLoaded = 0;
Interceptor.attach(Module.findExportByName(null, 'android_dlopen_ext'), {
    onEnter: function(args) {
        var library_path = Memory.readCString(args[0])
        if (library_path.indexOf(Location) >= 0) {
            console.warn("Loading library : " + library_path)
            FileLoaded = 1;
        }
    },
    onLeave: function(retVal) {
        if (FileLoaded == 1) {
            var LibBase = Module.findBaseAddress(Location);
            var JNIAddr = Module.findExportByName(Location, 'JNI_OnLoad');
            Interceptor.attach(JNIAddr, {
                onEnter: function(args) {
                    Stalker.follow({
                        events: {
                            call: true,
                            ret: false,
                            exec: false,
                            block: false,
                            compile: false
                        },
                        onReceive: function(events) {
                            var calls = Stalker.parse(events, {
                                annotate: true, 
                            });                          
                            for (var i = 0; i < calls.length; i++) {
                                var call = calls[i];
                                if (call[0] !== 'call') break;
                                   if (getModuleInfoByName(call[2]) == Location) {
                                      Check = call[2].sub(LibBase);
                                   }
                                 try {
                                    console.log((' '.repeat(call[3] * 2)) + '↳ calling ' + getModuleInfoByName(call[2]), call[2]);
                                 }catch(e){ console.error(e)}
                            }
                        },
                    })
                },
                onLeave: function(ret_val) {
                    Stalker.unfollow();
                }
            });   
        }
    }
})

function getModuleInfoByName(fnPtr) {
    if (fnPtr != null) {            
      var ModName = Process.getModuleByAddress(fnPtr).name;
      return ModName;            
    }
}
