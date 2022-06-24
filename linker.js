var base;
var do_dlopen = null;
var call_ctor = null;

Process.findModuleByName('linker64').enumerateSymbols().forEach(function(sym) {
    if (sym.name.indexOf('do_dlopen') >= 0) {
        do_dlopen = sym.address;
        console.log("dl_open : ",do_dlopen);
    } else if (sym.name.indexOf('call_constructor') >= 0) {
        call_ctor = sym.address;
         console.log("call_ctor : ",call_ctor)
    }
})

Interceptor.attach(do_dlopen, function () {
    var what = this.context['x0'].readUtf8String();
    console.warn(what);
    if (what != null && what.indexOf('libejlmecjfbcfp.so') >= 0) {
       // this.context['x0'].writeUtf8String("/system/lib64/libRS.so");
       
        Interceptor.attach(call_ctor, function () {
            Interceptor.detachAll();
           // console.log('loading target');
            const module = Process.findModuleByName("libejlmecjfbcfp.so");
            console.warn("Module Base : ",module.base);
            base = module.base;
            // DoStuff






        })
        
       
    }
})
