/* Bypass Frida Detection Based On Port Number */
Interceptor.attach(Module.findExportByName("libc.so", "connect"), {
    onEnter: function(args) {
        var memory = Memory.readByteArray(args[1], 64);
        var b = new Uint8Array(memory);
        if (b[2] == 0x69 && b[3] == 0xa2 && b[4] == 0x7f && b[5] == 0x00 && b[6] == 0x00 && b[7] == 0x01) {
            this.frida_detection = true;
        }
    },
    onLeave: function(retval) {
        if (this.frida_detection) {
            console.log("Frida Bypassed");
            retval.replace(-1);
        }
    }
});
Interceptor.attach(Module.findExportByName(null, "connect"), {
    onEnter: function(args) {
        var family = Memory.readU16(args[1]);
        if (family !== 2) {
            return
        }
        var port = Memory.readU16(args[1].add(2));
        port = ((port & 0xff) << 8) | (port >> 8);
        if (port === 27042) {
            console.log('frida check');
            Memory.writeU16(args[1].add(2), 0x0101);
        }
    }
});
/* Bypass TracerPid Detection Based On Pid Status */
var fgetsPtr = Module.findExportByName("libc.so", "fgets");
var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
Interceptor.replace(fgetsPtr, new NativeCallback(function(buffer, size, fp) {
    // console.warn(buffer);
    var retval = fgets(buffer, size, fp);
    var bufstr = Memory.readUtf8String(buffer);
    if (bufstr.indexOf("TracerPid:") > -1) {
        Memory.writeUtf8String(buffer, "TracerPid:\t0");
        console.log("Bypassing TracerPID Check");
    }
    return retval;
}, 'pointer', ['pointer', 'int', 'pointer']))
/* Bypass Ptrace Checks */
Interceptor.attach(Module.findExportByName(null, "ptrace"), {
    onEnter: function(args) {},
    onLeave: function(retval) {
        console.log("Ptrace Bypassed");
        retval.replace(0);
    }
})
/* Watch Child Process Forking */
var fork = Module.findExportByName(null, "fork")
Interceptor.attach(fork, {
    onEnter: function(args) {},
    onLeave: function(retval) {
        var pid = parseInt(retval.toString(16), 16)
        console.log("Child Process PID : ", pid)
    }
})
/*
Interceptor.attach(Module.getExportByName(null,"__android_log_print"), {
        onEnter: function (args) {
            console.warn(args[0],args[1].readCString(),args[2].readCString(),);
            }
        }
    );
*/
/* Screenshot Detection Bypass  */
Java.perform(function() {
    try {
        var surface_view = Java.use('android.view.SurfaceView');
        var set_secure = surface_view.setSecure.overload('boolean');
        set_secure.implementation = function(flag) {
            set_secure.call(false);
        }
        var window = Java.use('android.view.Window');
        var SFlag = window.setFlags.overload('int', 'int');
        var window_manager = Java.use('android.view.WindowManager');
        var layout_params = Java.use('android.view.WindowManager$LayoutParams');
        SFlag.implementation = function(flags, mask) {
            flags = (flags.value & ~layout_params.FLAG_SECURE.value);
            SFlag.call(this, flags, mask);
        }
    } catch (err) {
        console.error(err);
    }
})
/* Xposed Detection Bypass */
Java.perform(function() {
    try {
        var cont = Java.use("java.lang.String");
        cont.contains.overload("java.lang.CharSequence").implementation = function(checks) {
            var check = checks.toString();
            if (check.indexOf("libdexposed") >= 0 || check.indexOf("libsubstrate.so") >= 0 || check.indexOf("libepic.so") >= 0 || check.indexOf("libxposed") >= 0) {
                var BypassCheck = "libpkmkb.so";
                return this.contains.call(this, BypassCheck);
            }
            return this.contains.call(this, checks);
        }
    } catch (erro) {
        console.error(erro);
    }
    try {
        var StacktraceEle = Java.use("java.lang.StackTraceElement");
        StacktraceEle.getClassName.overload().implementation = function() {
            var Flag = false;
            var ClazzName = this.getClassName();
            if (ClazzName.indexOf("com.saurik.substrate.MS$2") >= 0 || ClazzName.indexOf("de.robv.android.xposed.XposedBridge") >= 0) {
                console.log("STE Classes : ", this.getClassName())
                Flag = true;
                if (Flag) {
                    var StacktraceEle = Java.use("java.lang.StackTraceElement");
                    StacktraceEle.getClassName.overload().implementation = function() {
                        var gMN = this.getMethodName();
                        if (gMN.indexOf("handleHookedMethod") >= 0 || gMN.indexOf("handleHookedMethod") >= 0 || gMN.indexOf("invoked") >= 0) {
                            console.log("STE Methods : ", this.getMethodName());
                            return "ulala.ulala";
                        }
                        return this.getMethodName();
                    }
                }
                return "com.android.vending"
            }
            return this.getClassName();
        }
    } catch (errr) {
        console.error(errr);
    }
})
/* VPN Related Checks */
Java.perform(function() {
    var NInterface = Java.use("java.net.NetworkInterface");
    try {
        NInterface.isUp.overload().implementation = function() {
            //console.log("Network Down");      
            return false;
            // may cause connectivity lose in rare case so be careful
        }
    } catch (err) {
        console.error(err);
    }
    try {
        var NInterface = Java.use("java.net.NetworkInterface");
        NInterface.getName.overload().implementation = function() {
            var IName = this.getName();
            if (IName == "tun0" || IName == "ppp0" || IName == "p2p0" || IName == "ccmni0" || IName == "tun") {
                console.log("Detected Interface Name : ", JSON.stringify(this.getName()));
                return "FuckYou";
            }
            return this.getName();
        }
    } catch (err) {
        console.error(err);
    }
    try {
        var GetProperty = Java.use("java.lang.System");
        GetProperty.getProperty.overload("java.lang.String").implementation = function(getprop) {
            if (getprop.indexOf("http.proxyHost") >= 0 || getprop.indexOf("http.proxyPort") >= 0) {
                var newprop = "CKMKB"
                return this.getProperty.call(this, newprop);
            }
            return this.getProperty(getprop);
        }
    } catch (err) {
        console.error(err);
    }
    try {
        var NCap = Java.use("android.net.NetworkCapabilities");
        NCap.hasTransport.overload("int").implementation = function(values) {
            console.log("HasTransport Check Detected ");
            if (values == 4)
                return false;
            else
                return this.hasTransport(values);
        }
    } catch (e) {
        console.error(e);
    }
})
/* Developer Mod Check Bypass */
Java.perform(function() {
    var SSecure = Java.use("android.provider.Settings$Secure");
    SSecure.getStringForUser.overload('android.content.ContentResolver', 'java.lang.String', 'int').implementation = function(Content, Name, Flag) {
        if (Name.indexOf("development_settings_enabled") >= 0) {
            console.log(Name);
            var Fix = "fuckyou";
            return this.getStringForUser.call(this, Content, Fix, Flag);
        }
        return this.getStringForUser(Content, Name, Flag);
    }
})