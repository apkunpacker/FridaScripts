Java.perform(function() {
    /*1st Encryption*/
    try {
        var ASEHC = Java.use("obfuse.NPStringFog");
        if (ASEHC) {
            console.warn("APK STRING ENCRYPTION HIGH COMPATIBILITY DETECTED");
        }
        ASEHC.decode.overload("java.lang.String").implementation = function(HC) {
            console.log("Encrypted : ", HC);
            var decrypted = this.decode(HC);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, HC);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION HIGH COMPATIBILITY NOT FOUND ");
    }
    /* 2nd Encryption */
    try {
        var ASEHS = Java.use("n.NPStringFog");
        if (ASEHS) {
            console.warn("APK STRING ENCRYPTION HIGH STRENGTH DETECTED");
        }
        ASEHS.decode.overload('[B', 'java.lang.String').implementation = function(bye, str) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'double').implementation = function(bye, str, doub) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, doub);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, doub);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'int').implementation = function(bye, str, ins) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, ins);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, ins);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'float').implementation = function(bye, str, flow) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, flow);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, flow);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'long').implementation = function(bye, str, lone) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, lone);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, lone);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'boolean').implementation = function(bye, str, boom) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, boom);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, boom);
        }
        ASEHS.decode.overload('[B', 'java.lang.String', 'boolean', 'boolean').implementation = function(bye, str, boom1, boom2) {
            console.log("Encrypted : ", str);
            var decrypted = this.decode(bye, str, boom1, boom2);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, str, boom1, boom2);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION HIGH STRENGTH NOT FOUND ");
    }
    /* 3rd Encryption */
    try {
        var ASEHSE = Java.use("nplus.n.p.NPStringFogPlus")
        if (ASEHSE) {
            console.warn("APK STRING ENCRYPTION HIGH STRENGTH ENHANCED DETECTED");
        }
        ASEHSE.decode.overload('[B').implementation = function(bye) {
            console.log("Encrypted Array in Bytes");
            var decrypted = this.decode(bye);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye);
        }
        ASEHSE.decode.overload('[B', 'double').implementation = function(bye, doub) {
            console.log("Encrypted Array + Double");
            var decrypted = this.decode(bye, doub);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, doub);
        }
        ASEHSE.decode.overload('[B', 'int').implementation = function(bye, ins) {
            console.log("Encrypted Array + Int: ", ins);
            var decrypted = this.decode(bye, ins);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, ins);
        }
        ASEHSE.decode.overload('[B', 'float').implementation = function(bye, flow) {
            console.log("Encrypted Arrays + float: ", flow);
            var decrypted = this.decode(bye, flow);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, flow);
        }
        ASEHSE.decode.overload('[B', 'long').implementation = function(bye, lone) {
            console.log("Encrypted Arrays + long : ", lone);
            var decrypted = this.decode(bye, lone);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, lone);
        }
        ASEHSE.decode.overload('[B', 'boolean').implementation = function(bye, boom) {
            console.log("Encrypted Arrays + Boolean : ", boom);
            var decrypted = this.decode(bye, boom);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, boom);
        }
        ASEHSE.decode.overload('[B', 'boolean', 'boolean').implementation = function(bye, boom1, boom2) {
            console.log("Encrypted Arrays + 2 booleans ", boom1, boom2);
            var decrypted = this.decode(bye, boom1, boom2);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, bye, boom1, boom2);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION HIGH STRENGTH ENHANCED NOT FOUND ");
    }
    /*4th encryption */
    try {
        var ASEHCE = Java.use("np.e.NPStringFog");
        var ASEHCE1 = Java.use("np.e.e");
        if (ASEHCE || ASEHCE1) {
            console.warn("APK STRING ENCRYPTION HIGH COMPATIBILITY ENHANCED DETECTED");
        }
        ASEHCE.decode.overload("java.lang.String").implementation = function(HCE) {
            console.log("Encrypted : ", HCE);
            var decrypted = this.decode(HCE);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, HCE);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION HIGH COMPATIBILITY ENHANCED NOT FOUND ");
    }
    /*5th encryption */
    /* Warning only use this when none of other encryption detected as it depend on tracing all decryption class and throw error if class not found */
    /*      
try{      
setTimeout(function() 
{

var Color = {
    RESET: "\x1b[39;49;00m", Black: "0;01", Blue: "4;01", Cyan: "6;01", Gray: "7;11", Green: "2;01", Purple: "5;01", Red: "1;01", Yellow: "3;01",
    Light: {
        Black: "0;11", Blue: "4;11", Cyan: "6;11", Gray: "7;01", Green: "2;11", Purple: "5;11", Red: "1;11", Yellow: "3;11"
    }
};

var LOG = function (input, kwargs) {
    kwargs = kwargs || {};
    var logLevel = kwargs['l'] || 'log', colorPrefix = '\x1b[3', colorSuffix = 'm';
    if (typeof input === 'object')
        input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
    if (kwargs['c'])
        input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
    console[logLevel](input);
};

var printBacktrace = function () {
    Java.perform(function() {
        var android_util_Log = Java.use('android.util.Log'), java_lang_Exception = Java.use('java.lang.Exception');
        LOG(android_util_Log.getStackTraceString(java_lang_Exception.$new()), { c: Color.Gray });
    });
};
function traceClass(targetClass) {
    var hook;
    try {
        hook = Java.use(targetClass);
    } catch (e) {
        console.error("trace class failed", e);
        return;
    }

    var methods = hook.class.getDeclaredMethods();
    hook.$dispose();

    var parsedMethods = [];
 
    methods.forEach(function (method) 
    {
        var methodStr = method.toString();
        var methodReplace = methodStr.replace(targetClass + ".", "TOKEN").match(/\sTOKEN(.*)\(/)[1];
         parsedMethods.push(methodReplace);
    });
 
    uniqBy(parsedMethods, JSON.stringify).forEach(function (targetMethod)
     {
        {
        traceMethod(targetClass + '.' + targetMethod);
        }
     }
    )
} 
function traceMethod(targetClassMethod) {
    var delim = targetClassMethod.lastIndexOf('.');
    if (delim === -1)
        return;
    var targetClass = targetClassMethod.slice(0, delim);
    var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length);

    var hook = Java.use(targetClass);
    var overloadCount = hook[targetMethod].overloads.length;

    LOG({ tracing: targetClassMethod, overloaded: overloadCount }, { c: Color.Green });

    for (var i = 0; i < overloadCount; i++) {
        hook[targetMethod].overloads[i].implementation = function () {
            var log = { '#': targetClassMethod, args: [] };

            for (var j = 0; j < arguments.length; j++) {
                var arg = arguments[j];
                
                if (j === 0 && arguments[j]) {
                    if (arguments[j].toString() === '[object Object]') {
                        var s = [];
                        for (var k = 0, l = arguments[j].length; k < l; k++) {
                            s.push(arguments[j][k]);
                        }
                        arg = s.join('');
                    }
                }
                log.args.push({ i: j, o: arg, s: arg ? arg.toString(): 'null'});
            }
            var retval;
            try {
                retval = this[targetMethod].apply(this, arguments);              
                log.returns = { val: retval, str: retval ? retval.toString() : null };              
            } catch (e) {
                console.error(e);
            }
            LOG(log, { c: Color.Yellow });
           return retval;
        }
    }
}
function uniqBy(array, key) {
    var seen = {};
    return array.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}
var Main = function() {
    Java.perform(function () { 
    var ASEA= Java.use("obfuse3.obfuse.StringPool");
    if(ASEA) { console.warn("APK STRING ENCRYPTION ADVANCE DETECTED"); }
    try{
    [ 'obfuse3.obfuse.StringPool'].forEach(traceClass); 
    } catch(err) { console.warn("APK STRING ENCRYPTION ADVANCE NOT FOUND"); }
    });
};
Java.perform(Main);
},0) 
       
} catch(err)
{ console.error("APK STRING ENCRYPTION ADVANCE NOT FOUND "); }

*/
    /* 6th Encryption */
    try {
        var ASEE = Java.use("obfuse4.obfuse.NPStringFog4");
        if (ASEE) {
            console.warn("APK STRING ENCRYPTION EXTREME DETECTED");
        }
        ASEE.decode.overload("java.lang.String").implementation = function(Ex) {
            console.log("Encrypted : ", Ex);
            var decrypted = this.decode(Ex);
            console.warn("Decrypted : ", decrypted);
            return this.decode.call(this, Ex);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION EXTREME NOT FOUND ");
    }
    /* 7th encryption */
    try {
        var ASEN = Java.use("np.e.e2");
        var ASEN2 = Java.use("obfuse5.obfuse.NPStringFog5");
        var ASEN3 = Java.use("obfuse5.obfuse.StringPool");
        if (ASEN || ASEN2 || ASEN3) {
            console.warn("APK STRING ENCRYPTION NEW DETECTED");
        }
        ASEN2.d.overload("int", "java.lang.String").implementation = function(T, N) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(T, N);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, T, N);
        }
        ASEN2.d.overload("boolean", "java.lang.String").implementation = function(B, N) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(B, N);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, B, N);
        }
        ASEN2.d.overload("java.lang.String").implementation = function(N) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(N);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, N);
        }
        ASEN2.d.overload("java.lang.String", "int").implementation = function(N, T) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(N, T);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, N, T);
        }
        ASEN2.d.overload("boolean", "java.lang.String", "boolean").implementation = function(B, N, B2) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(B, N, B2);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, B, N, B2);
        }
        ASEN2.d.overload("java.lang.String", "boolean").implementation = function(N, B) {
            console.log("Encrypted : ", N);
            var decrypted = this.d(N, B);
            console.warn("Decrypted : ", decrypted);
            return this.d.call(this, N, B);
        }
    } catch (err) {
        console.error("APK STRING ENCRYPTION NEW NOT FOUND ");
    }
})