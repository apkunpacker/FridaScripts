var prctlPtr = Module.findExportByName(null, 'prctl');
var prctlOri = new NativeFunction(prctlPtr,'int',['int','int','int','int','int'])
Interceptor.replace(prctlPtr, new NativeCallback( function (a,b,c,d,e){
    if (a == 15){
        var pname = Memory.readUtf8String(ptr(b))
        console.warn(pname);
        if (pname.includes("plus.canary")){
            console.log(a,b,c,d,e)
            for ( var i=0; i< 9 ;i++){
                pname = Memory.readUtf8String(ptr(b-i))
                console.log("Brute: "+i+ " "+pname)
            }
           // Memory.writeS64(ptr(b-9),0x306362617830)
            Memory.writeUtf8String(ptr(b-9),"com.android.vending")
            pname = Memory.readUtf8String(ptr(b-9))
            console.log("YAY ! new process name : ",pname)
            var fd = prctlOri(a,b-9,c,d,e)
            return fd
            }
        }
    var fd = prctlOri(a,b,c,d,e)
    return fd
    }, 'int', ['int','int','int','int','int']));