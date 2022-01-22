var Color = {
    RESET: "\x1b[39;49;00m",
    Black: "0;01",
    Blue: "4;01",
    Cyan: "6;01",
    Gray: "7;11",
    Green: "2;01",
    Purple: "5;01",
    Red: "1;01",
    Yellow: "3;01",
    Light: {
        Black: "0;11",
        Blue: "4;11",
        Cyan: "6;11",
        Gray: "7;01",
        Green: "2;11",
        Purple: "5;11",
        Red: "1;11",
        Yellow: "3;11"
    }
};
var LOG = function(input, kwargs) {
    kwargs = kwargs || {};
    var logLevel = kwargs['l'] || 'log',
        colorPrefix = '\x1b[3',
        colorSuffix = 'm';
    if (typeof input === 'object')
        input = JSON.stringify(input, null, kwargs['i'] ? 2 : null);
    if (kwargs['c'])
        input = colorPrefix + kwargs['c'] + colorSuffix + input + Color.RESET;
    console[logLevel](input);
};

function Blue(str) {
    LOG(str, {
        c: Color.Blue
    });
}

function Green(str) {
    LOG(str, {
        c: Color.Green
    });
}

function Purple(str) {
    LOG(str, {
        c: Color.Purple
    });
}

function Red(str) {
    LOG(str, {
        c: Color.Red
    });
}

function Yellow(str) {
    LOG(str, {
        c: Color.Yellow
    });
}

function getModuleInfoByAddress(fnPtr) {
    var Modules = Process.enumerateModules();
    var ModuleName = null,
        BaseAddress = null;
    Modules.forEach(function(Module) {
        if (Module.base <= fnPtr && fnPtr.toInt32() <= Module.base.toInt32() + Module.size) {
            ModuleName = Module.name;
            BaseAddress = Module.base;
            return false;
        }
    });
    return BaseAddress;
}

function getModuleInfoByName(fnPtr) {
    var Modules = Process.enumerateModules();
    var ModuleName = null,
        BaseAddress = null;
    Modules.forEach(function(Module) {
        if (Module.base <= fnPtr && fnPtr.toInt32() <= Module.base.toInt32() + Module.size) {
            ModuleName = Module.name;
            BaseAddress = Module.base;
            return false;
        }
    });
    return ModuleName;
}

function FindBaseAddess(ModName) {
    return Module.findBaseAddress(ModName);
}

function D2HS(number) {
    if (number < 0) {
        number = 0xFFFFFFFF + number + 1;
    }
    return number.toString(16).toLowerCase();
}
var RevealNativeMethods = function() {
    var pSize = Process.pointerSize;
    var env = Java.vm.getEnv();
    var RegisterNatives = 215,
        FindClassIndex = 6;
    var jclassAddress2NameMap = {};

    function getNativeAddress(idx) {
        return env.handle.readPointer().add(idx * pSize).readPointer();
    }
    Interceptor.attach(getNativeAddress(FindClassIndex), {
        onEnter: function(args) {
            jclassAddress2NameMap[args[0]] = args[1].readCString();
        }
    });
    Interceptor.attach(getNativeAddress(RegisterNatives), {
        onEnter: function(args) {
            for (var i = 0, nMethods = parseInt(args[3]); i < nMethods; i++) {
                var structSize = pSize * 3;
                var methodsPtr = ptr(args[2]);
                var signature = methodsPtr.add(i * structSize + pSize).readPointer();
                var fnPtr = methodsPtr.add(i * structSize + (pSize * 2)).readPointer();
                var jClass = jclassAddress2NameMap[args[0]].split('/');
                var MODULEBase = getModuleInfoByAddress(fnPtr);
                var MODULEName = getModuleInfoByName(fnPtr);
                var CLASS = jClass[jClass.length - 1];
                var PACKAGE = jClass.slice(0, -1).join('.');
                var METHOD = methodsPtr.readPointer().readCString();
                var SIGNATURE = signature.readCString();
                var BaseAddress = FindBaseAddess(MODULEName);
                var BAddrInt = BaseAddress.toInt32();
                var FnPointer = fnPtr.toInt32();
                var OffsetDecimal = FnPointer - BAddrInt;
                var Offset = D2HS(OffsetDecimal);
                Interceptor.attach(fnPtr, {
                    onEnter: function(args) {
                        Green(PACKAGE + "." + CLASS + ";->" + METHOD + SIGNATURE);
                        Yellow("Library : " + MODULEName + " Base : " + MODULEBase + " Function Address : " + fnPtr + " Offset : " + "0x" + Offset + " Arg :  " + args[0] + " " + args[1]);
                        // console.warn(CLASS+";->"+METHOD,"Called from:-->:\n" +Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n") );
                    },
                    onLeave: function(retval) {
                        Red(PACKAGE + "." + CLASS + ";->" + METHOD + " [Ret] " + JSON.stringify(retval.toInt32()) + "\n");
                    }
                })
            }
        }
    });
}
Java.perform(RevealNativeMethods);