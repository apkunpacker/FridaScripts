var ishook_libart = false;
var new_so_base = 0;
var new_so_size = 0;
var JNI_RegisterNatives_array = [];
var jiagu_sdk = [];
var hook_call_addr = [];
var jiagu_vmp = [];
var addrmemcpy = Module.findExportByName("libc.so", "memcpy");
var addrmalloc = Module.findExportByName("libc.so", "malloc");
var addrmmap = Module.findExportByName("libc.so", "mmap");
var mprotect = Module.findExportByName("libc.so", "mprotect");
var addrstrstr = Module.findExportByName("libc.so", "strstr");
var addrstrlen = Module.findExportByName("libc.so", "strlen");
var addrdlopen = Module.findExportByName("libc.so","dlopen");
var addruncompress = Module.findExportByName('libz.so', 'uncompress');
var addrpthread_create = Module.findExportByName("libc.so", "pthread_create");
var addrstrdup = Module.findExportByName("libc.so","strdup");
var k = 1;
var new_so_dump = 1;
var n = 0;
var str_flag = 0;
var up_flag = 1;
var app_activity = 0;
var App_Activity_str = "";
var App_Activity = "";
var dex_up_flag = 1;
var jiagu_end = 0;
var packname_flag = 1;
var pkg_name ="com.tilks.arscmerge";
var pathDir = "";
var so_dump = 0;
var oat_dump = 0;
var so_data_k = 0;
var new_so_pht = 0;
var new_so_dyn = 0;
var new_so_pltrel = 0;
var new_so_dynrel = 0;
var new_so_pltrel_size = 0;
var vmp_fun_addr = 0;
function get_pkg_dir() {
    var fileclass = Java.use("java.io.File");
    var mysavePath = "/data/data/" + pkg_name + "/files";
    pathDir = fileclass.$new(mysavePath);
    if (!pathDir.exists()) {
        pathDir.mkdirs();
    }
}

function chmod(path) {
    var chmodPtr = Module.getExportByName('libc.so', 'chmod');
    var chmod = new NativeFunction(chmodPtr, 'int', ['pointer', 'int']);
    var cPath = Memory.allocUtf8String(path);
    chmod(cPath, 755);
}
function find_vmp_fun() {
    vmp_fun_addr = 0;
}
 
if (mprotect != 0) {
    Interceptor.attach((mprotect), {
        onEnter: function (args) {
            if (up_flag == 1) {                
                if (args[1] > 0x10000) {
                    new_so_base = args[0];
                    new_so_size = args[1];
                    console.log("new_so_base:", new_so_base, "base_size:", new_so_size);
                    up_flag = 0;
                    new_so_dump = 1;
                }
            }
 
            if (dex_up_flag == 1) {
                if (args[2] == 7) {
                    var oat_base = args[0];
                    var oat_size = parseInt(args[1]);
                    console.log('find oat addr is', oat_base, "oat size is ", oat_size);
                    var file_path = pathDir + "/dump_" + oat_base.toString() + ".oat";
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(oat_base), oat_size, 'rwx');
                        var oat_buffer = ptr(oat_base).readByteArray(oat_size);
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump oat in]:" + file_path);
                    }
                    oat_dump += 1;
                }
            }
        }
    })
}
 
if (addruncompress != 0) {
    Interceptor.attach((addruncompress), {
        onEnter: function (args) {
            if (new_so_base == 0) {
                up_flag = 1;
                n = 1;
            }
        }
    })
}
 
if (addrstrlen != 0) {
    Interceptor.attach((addrstrlen), {
        onEnter: function (args) {
            if (str_flag == 11) {
                var str_len = Memory.readCString(args[0]);
                if (str_len.length > 10){
                    console.log("string len is",str_len);
                }
            }
            if (app_activity == 1){
                // Get APP Activity Entry
                if (Memory.readCString(args[0]) == "activityName"){
                    console.log("App_Application_Entry is:",App_Activity_str);
                    app_activity = 0;
                    App_Activity = App_Activity_str;
                }
                 App_Activity_str = Memory.readCString(args[0]);
                 dex_up_flag = 0;
                 str_flag = 0;
            }
            if(jiagu_end == 1){
                console.log("================== The APP xxx jiagu info ==================");
                console.log("");
                console.log("App_Application_Entry is:",App_Activity);
                console.log("dump save path is ", pathDir);
                if(so_dump == 1){
                    console.log("xxx_jiagu_so dump over");
                }
                if(oat_dump > 0){
                    console.log("The App oat_dex dump:",oat_dump);
                }
                if (JSON.stringify(jiagu_sdk).indexOf(JSON.stringify("onCreate")) != -1){
                    console.log("The App find ocCreate VMP");
                }
                if (JSON.stringify(jiagu_sdk).indexOf(JSON.stringify("interface11"))!= -1){
                    console.log("The App find interface11 sdk!");
                }
                if(JSON.stringify(jiagu_sdk).indexOf(JSON.stringify("mark"))!= -1){
                    console.log("The App find mark sdk!");
                }
                console.log("");
                console.log("======================= xxx jiagu end =======================");
                jiagu_end = 0;
            }
        }
    })
}
 
if (addrstrdup != 0) {
    Interceptor.attach((addrstrdup), {
        onEnter: function (args) {
            if (k == 1) {
                var str = Memory.readCString(args[0]);
                console.log("copy string is :", str);
                if (packname_flag == 1){
                    if(str.startsWith("/data/app/com")){
                        var pkg_name_str = str.split("/")[3];
                        pkg_name = pkg_name_str.split("-")[0];
                        console.log("pkg_name is:", pkg_name);
                        packname_flag = 0;
                        get_pkg_dir();
                    }
                }
            }
        }
    })
}
 
if (addrstrstr != 0) {
    Interceptor.attach((addrstrstr), {
        onEnter: function (args) {
            if (str_flag == 1) {
                var str = Memory.readCString(args[0]);
                var str1 = Memory.readCString(args[1]);
                console.log("string in str :", str,str1);
            }
        }
    })
}
 
if (addrmemcpy != 0) {
    Interceptor.attach((addrmemcpy), {
        onEnter: function (args) {
            if (new_so_dump == 1) {
                var file_path = pathDir + "/dump_so_" + new_so_base + ".so";
                chmod(file_path);
                var file_handle = new File(file_path, "wb");
               // chmod(file_path);
                if (file_handle) {
                    Memory.protect(ptr(new_so_base), parseInt(new_so_size), 'rwx');
                    var oat_buffer = ptr(new_so_base).readByteArray(parseInt(new_so_size));
                    file_handle.write(oat_buffer);
                    file_handle.flush();
                    file_handle.close();
                    console.log("[dump  so in]:" + file_path);
                }
                find_vmp_fun();
                new_so_dump = 0
            }
            if (n == 1) {
                console.log("memcpy-->src,dest,len:",args[1],args[0],args[2]);
                if(args[2]== 0x100){
                    so_data_k = 5;
                    new_so_pht = args[0]
                }
                else if(args[2] == 0xb4){
                    n = 0;
 
                    var file_path = pathDir + "/dump_pht_" + new_so_pht + ".dat";
                    chmod(file_path);
                    // console.log("begin save so dat!",file_path);
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(new_so_pht), 0x100, 'rwx');
                        var oat_buffer = ptr(new_so_pht).readByteArray(0x100);
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump pht dat in]:" + file_path);
                    }
 
                    var file_path = pathDir + "/dump_dyn_" + new_so_dyn + ".dat";
                    chmod(file_path);
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(new_so_dyn), 0xd8, 'rwx');
                        var oat_buffer = ptr(new_so_dyn).readByteArray(0xd8);
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump dyn dat in]:" + file_path);
                    }
 
                    var file_path = pathDir + "/dump_pltrel_" + new_so_pltrel + ".dat";
                    chmod(file_path);
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(new_so_pltrel), new_so_pltrel_size, 'rwx');
                        var oat_buffer = ptr(new_so_pltrel).readByteArray(new_so_pltrel_size);
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump pltrel dat in]:" + file_path);
                    }
 
                    var file_path = pathDir + "/dump_dynrel_" + new_so_dynrel + ".dat";
                    chmod(file_path);
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(new_so_dynrel), 0x4a58, 'rwx');
                        var oat_buffer = ptr(new_so_dynrel).readByteArray(0x4a58);
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump dynrel dat in]:" + file_path);
                    }
 
                    var file_path = pathDir + "/dump_newso_" + new_so_base + ".so";
                    chmod(file_path);
                    var file_handle = new File(file_path, "wb");
                    if (file_handle) {
                        Memory.protect(ptr(new_so_base), parseInt(new_so_size), 'rwx');
                        var oat_buffer = ptr(new_so_base).readByteArray(parseInt(new_so_size));
                        file_handle.write(oat_buffer);
                        file_handle.flush();
                        file_handle.close();
                        console.log("[dump new so in]:" + file_path);
                        so_dump = 1;
                    }
                }
                else if (so_data_k > 0){
                    if (so_data_k == 1){
                        var size_buff = args[0].sub(new_so_base);
                        new_so_size = size_buff.add(args[2]);
                        console.log("new_so_size is :",new_so_size);
                    }
                    else if (args[2] > 0xd0){
                        if (args[2] == 0xd8){
                            new_so_dyn = args[0];
                            so_data_k -= 1;
                        }
                        else if(args[2] > 0x800 && args[2] < 0x1000){
                            new_so_pltrel = args[0];
                            new_so_pltrel_size = parseInt(args[2]);
                            so_data_k -= 1;
                        }
                        else if (args[2] > 0x4000 && args[2] < 0x5000){
                            new_so_dynrel = args[0];
                            so_data_k -= 1;
                        }
                        else {
                            so_data_k -= 1;
                        }
                    }
                }
            }
        },
 
        onLeave: function (letval) {
 
        }
    })
}
 
function hook_libart() {
    if (ishook_libart === true) {
        return;
    }
    var symbols = Module.enumerateSymbolsSync("libart.so");
    var addrCheckcakkArgs = null;
    var addrGetStringUTFChars = null;
    var addrNewStringUTF = null;
    var addrFindClass = null;
    var addrGetMethodID = null;
    var addrGetStaticMethodID = null;
    var addrGetFieldID = null;
    var addrGetStaticFieldID = null;
    var addrRegisterNatives = null;
    var addrAllocObject = null;
    var addrCallObjectMethod = null;
    var addrGetObjectClass = null;
    var addrReleaseStringUTFChars = null;
    var addCallStaticObjectMethodV = null;
    var addCallObjectMethodV = null;
    var addCallStaticbooleanMethodV = null;
    var class_name = null;
    var vmp_hook = null;
    var GetOpcode_flag = null;
    var vmp_dex_data = [];
    var vmp_opcode_index_v = [];
    var vmp_opcode_v = [];
    var vmp_code_len = [];
 
    for (var i = 0; i < symbols.length; i++) {
        var symbol = symbols[i];
        if (symbol.name == "_ZN3art3JNI17GetStringUTFCharsEP7_JNIEnvP8_jstringPh") {
            addrGetStringUTFChars = symbol.address;
            console.log("GetStringUTFChars is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI12NewStringUTFEP7_JNIEnvPKc") {
            addrNewStringUTF = symbol.address;
            console.log("NewStringUTF is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI9FindClassEP7_JNIEnvPKc") {
            addrFindClass = symbol.address;
            console.log("FindClass is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI11GetMethodIDEP7_JNIEnvP7_jclassPKcS6_") {
            addrGetMethodID = symbol.address;
            console.log("GetMethodID is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI17GetStaticMethodIDEP7_JNIEnvP7_jclassPKcS6_") {
            addrGetStaticMethodID = symbol.address;
            console.log("GetStaticMethodID is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI10GetFieldIDEP7_JNIEnvP7_jclassPKcS6_") {
            addrGetFieldID = symbol.address;
            console.log("GetFieldID is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI16GetStaticFieldIDEP7_JNIEnvP7_jclassPKcS6_") {
            addrGetStaticFieldID = symbol.address;
            console.log("GetStaticFieldID is at ", symbol.address, symbol.name);
        } else if (symbol.name == "_ZN3art3JNI15RegisterNativesEP7_JNIEnvP7_jclassPK15JNINativeMethodi") {
            addrRegisterNatives = symbol.address;
            console.log("RegisterNatives is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI11AllocObjectEP7_JNIEnvP7_jclass") >= 0) {
            addrAllocObject = symbol.address;
            console.log("AllocObject is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI16CallObjectMethodEP7_JNIEnvP8_jobjectP10_jmethodIDz") >= 0) {
            addrCallObjectMethod = symbol.address;
            console.log("CallObjectMethod is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI14GetObjectClassEP7_JNIEnvP8_jobject") >= 0) {
            addrGetObjectClass = symbol.address;
            console.log("GetObjectClass is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI21ReleaseStringUTFCharsEP7_JNIEnvP8_jstringPKc") >= 0) {
            addrReleaseStringUTFChars = symbol.address;
            console.log("ReleaseStringUTFChars is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI23CallStaticObjectMethodVEP7_JNIEnvP7_jclassP10_jmethodIDSt9__va_list") >= 0) {
            addCallStaticObjectMethodV = symbol.address;
            console.log("CallStaticObjectMethodV is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI17CallObjectMethodVEP7_JNIEnvP8_jobjectP10_jmethodIDSt9__va_list") >= 0) {
            addCallObjectMethodV = symbol.address;
            console.log("CallObjectMethodV is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art3JNI24CallStaticBooleanMethodVEP7_JNIEnvP7_jclassP10_jmethodIDSt9__va_list") >= 0) {
            addCallStaticbooleanMethodV = symbol.address;
            console.log("CallStaticbooleanMethodV is at ", symbol.address, symbol.name);
        } else if (symbol.name.indexOf("_ZN3art8CheckJNI13CheckCallArgsERNS_18ScopedObjectAccessERNS_11ScopedCheckEP7_JNIEnvP8_jobjectP7_jclassP10_jmethodIDNS_10InvokeTypeEPKNS_7VarArgsE") >= 0) {
            addrCheckcakkArgs = symbol.address;
            console.log("CheckCallArgs is at ", symbol.address, symbol.name);
        }
    }
 
    if (addrGetObjectClass != null) {
        Interceptor.attach(addrFindClass, {
            onEnter: function (args) {
                console.log('');
                class_name = Memory.readCString(args[1]);
                console.log("Call GetObjectClass; obj_name:", class_name);
            },
            onLeave: function (letval) {
            }
        })
    }
 
    if (addrFindClass != null) {
        Interceptor.attach(addrFindClass, {
            onEnter: function (args) {
                class_name = Memory.readCString(args[1]);
                console.log("Call findclass; classname:", class_name);
            }
        })
    }
 
    if (addrCheckcakkArgs != null) {
        Interceptor.attach(addrCheckcakkArgs, {
            onEnter: function (args) {
                var args_list = Memory.readPointer(args[6]);
                console.log("Call CheckCallArgs; args:", args_list);
            }
        })
    }
 
    if (addrGetStaticMethodID != null) {
        Interceptor.attach(addrGetStaticMethodID, {
            onEnter: function (args) {
                var Method_name = Memory.readCString(args[2]);
                var Method_sig = Memory.readCString(args[3]);
                console.log("call GetStaticMethodID,class_name:", class_name, "Method_name:", Method_name, "sig:", Method_sig);
                if(Method_name == "currentPackageName"){
                    // packname_flag  = 1;
                    // str_flag = 1;
                }
                if(Method_name == "getSoPath2"){
                    n = 0;
                }
                if(Method_name == "hashCode"){
                    jiagu_end = 1;
                }
            }
        })
    }
 
    if (addrGetMethodID != null) {
        Interceptor.attach(addrGetMethodID, {
            onEnter: function (args) {
                var Method_name = Memory.readCString(args[2]);
                var Method_sig = Memory.readCString(args[3]);
                console.log("call GetMethodID,class_name:", class_name, "Method_name:", Method_name, "sig:", Method_sig);
            }
        })
    }
 
    if (addrGetFieldID != null) {
        Interceptor.attach(addrGetFieldID, {
            onEnter: function (args) {
                var Method_name = Memory.readCString(args[2]);
                var Method_sig = Memory.readCString(args[3]);
                console.log("call GetFieldID,className:", class_name, "Method_name:", Method_name, 'sig:', Method_sig);
                if (Method_name == "dexElements"){
                    dex_up_flag = 1;
                    str_flag = 1;
                }
            }
        })
    }
 
    if (addrGetStaticFieldID != null) {
        Interceptor.attach(addrGetStaticFieldID, {
            onEnter: function (args) {
                var Method_name = Memory.readCString(args[2]);
                var Method_sig = Memory.readCString(args[3]);
                console.log("call GetStaticFieldID,className:", class_name, "Method_name:", Method_name, "sig:", Method_sig);
                if(Method_name == "strEntryApplication"){
                    app_activity = 1;
                }
            }
        })
    }
 
    if (addCallStaticbooleanMethodV != null) {
        Interceptor.attach(addCallStaticbooleanMethodV, {
            onEnter: function (args) {
                var call_add = this.returnAddress;
            }
        })
    }
 
    if (addCallObjectMethodV != null) {
        Interceptor.attach(addCallObjectMethodV, {
            onEnter: function (args) {
                var call_address = this.returnAddress;
            }
        })
    }
 
    if (addrCallObjectMethod != null) {
        Interceptor.attach(addrCallObjectMethod, {
            onEnter: function (args) {
                var call_add = this.returnAddress;
            }
        })
    }
 
 
    if (addCallStaticObjectMethodV != null) {
        Interceptor.attach(addCallStaticObjectMethodV, {
            onEnter: function (args) {
                var call_add = this.returnAddress;
            }
        })
    }
 
    if (addrRegisterNatives != null) {
        Interceptor.attach(addrRegisterNatives, {
            onEnter: function (args) {
                var call_add = this.returnAddress;
                if (call_add < new_so_base.add(new_so_size) && call_add > new_so_base) {
                    call_so_name = "libjiagu_64.so";
                    console.log("Register_address:", call_add, "offset:", ptr(call_add).sub(new_so_base), "at:", call_so_name);
                    console.log("[RegisterNatives] method_count:", args[3]);
                } else {
                    var call_so_info = Process.getModuleByAddress(call_add);
                    var call_so_base = call_so_info.base;
                    var call_so_name = call_so_info.name;
                    console.log("Register_address:", call_add, "offset:", ptr(call_add).sub(call_so_base), "at:", call_so_name);
                    console.log("[RegisterNatives] method_count:", args[3]);
                }
 
                var methods_ptr = ptr(args[2]);
                var call_addr = this.returnAddress;
                var method_count = parseInt(args[3]);
                for (var i = 0; i < method_count; i++) {
                    var name_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3));
                    var sig_ptr = Memory.readPointer(methods_ptr.add(i * Process.pointerSize * 3 + Process.pointerSize));
                    var fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * 12 + 8));
                    var fuPtr = fnPtr_ptr.sub(1);
                    var name = Memory.readCString(name_ptr);
                    var sig = Memory.readCString(sig_ptr);
                    var module_base = new_so_base;
                    var offset = 0;
                    if (Process.findModuleByAddress(fnPtr_ptr)) {
                        var so_info = Process.getModuleByAddress(fnPtr_ptr);
                        module_base = so_info.base;
                        var so_name = so_info.name;
                        fuPtr = fnPtr_ptr.sub(1);
                        offset = fnPtr_ptr.sub(module_base);
                        console.log("[RegisterNatives] java_class:", class_name, "name:", name, "sig:", sig, "call_fun_Ptr:", fnPtr_ptr, "fnPtr:", fuPtr, "so_offset:", offset, "at :", so_name);
                    } else {
                        var so_name = "libjiagu_64.so";
                        if (parseInt(fnPtr_ptr) > parseInt(module_base)) {
                            offset = fnPtr_ptr.sub(module_base);
                        } else {
                            offset = module_base.sub(fnPtr_ptr);
                        }
                        if (parseInt(offset) > parseInt(new_so_size)) {
                            offset = fnPtr_ptr.sub(5);
                            fnPtr_ptr = Memory.readPointer(offset);
                            offset = fnPtr_ptr.sub(module_base);
                            if (parseInt(offset) > parseInt(new_so_size)) {
                                fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * 12 + 8));
                            } else {
                                console.log("Find shellcode,fix fuPtr!");
                            }
                            fuPtr = fnPtr_ptr.sub(1);
                            offset = fnPtr_ptr.sub(module_base);
                            fnPtr_ptr = Memory.readPointer(methods_ptr.add(i * 12 + 8));
                            console.log("[RegisterNatives] java_class:", class_name, "name:", name, "sig:", sig, "shell_Jump_Ptr:", fnPtr_ptr, "fnPtr:", fuPtr, "so_offset:", offset, "at :", so_name);
                        } else {
                            offset = fnPtr_ptr.sub(module_base);
                            console.log("[RegisterNatives] java_class:", class_name, "name:", name, "sig:", sig, "fnPtr:", fuPtr, "so_offset:", offset, "at :", so_name);
                        }
                    }
 
                    if(name == "onCreate"){
                        var jiagu_vmp_info = class_name +"/"+ name;
                        jiagu_vmp.push(jiagu_vmp_info);
                        console.log("find dex Methon onCreate code vmp in ",jiagu_vmp_info);
                        console.log("ocCreate code vmp info:\n",JSON.stringify(jiagu_vmp));
                    }
                    fuPtr = fnPtr_ptr.sub(1);
                    if (JSON.stringify(JNI_RegisterNatives_array).indexOf(JSON.stringify(fuPtr)) == -1) {
                        JNI_RegisterNatives_array.push(fuPtr);
                        JNI_RegisterNatives_array.push(name);
                        var func_addr = fnPtr_ptr;
                        var dex_code_len = 0;
                        var opcode_base = null;
                        var get_vmp_data_base = 0;
                        var temp = 0;
                        Interceptor.attach(func_addr, {
                            onEnter: function (args) {
                                var context_r = this.returnAddress;
                                var context_pc = JSON.stringify(this.context["pc"]);
                                console.log("Call_address:", context_r, "fun_address:", context_pc);
                                var pc_add = context_pc.replace(/\"/g, "");
                                for (var j = 0; j < JNI_RegisterNatives_array.length; j++) {
                                    if (JNI_RegisterNatives_array[j] == pc_add) {
                                        this.funname = undefined;
                                        if (JSON.stringify(hook_call_addr).indexOf(JSON.stringify(context_pc)) == -1) {
                                            hook_call_addr.push(context_r);
                                            console.log("Call_fun_begin-->", JNI_RegisterNatives_array[j + 1]);
                                            if(jiagu_sdk.indexOf(JNI_RegisterNatives_array[j + 1])== -1){
                                                jiagu_sdk.push(JNI_RegisterNatives_array[j + 1]);
                                            }
                                            console.log("fun_key0:", this.context.r0);
                                            console.log("fun_key1:", this.context.r1);
                                            console.log("fun_key2:", this.context.r2);
                                            k = 1;
                                            this.funname = JNI_RegisterNatives_array[j + 1];
                                            if(this.funname == "onCreate"){
                                                console.log("====================================================================");
                                                console.log("onCreate VMP begin!");
                                                // str_flag = 11;
                                                GetOpcode_flag = 1;
                                                if (vmp_fun_addr != 0 && vmp_hook == null) {
                                                    name = "vmp_fun";
                                                    JNI_RegisterNatives_array.push(vmp_fun_addr);
                                                    JNI_RegisterNatives_array.push(name);
                                                    Interceptor.attach(ptr(vmp_fun_addr), {
                                                        onEnter: function (args) {
                                                            if (GetOpcode_flag == 1) {
                                                                if (get_vmp_data_base == 0) {
                                                                    var data_base = Memory.readPointer(ptr(this.context.r9));
                                                                    var dex_info = Process.getModuleByAddress(data_base);
                                                                    var data_offset = data_base.sub(dex_info.base);
                                                                    var dex_vmp_data_len =  Memory.readPointer(data_base.sub(4));
                                                                    console.log("dex name is :", dex_info.name);
                                                                    console.log("vmp data base is:", data_base, "offset:", data_offset);
                                                                    console.log("vmp data len is :",ptr(parseInt(dex_vmp_data_len)*2));
                                                                    console.log(hexdump(data_base,{length:parseInt(dex_vmp_data_len)*2}));
                                                                    console.log("");
                                                                    get_vmp_data_base = 1;
                                                                    var xor_key = this.context.r1;
                                                                    var data_buf = Memory.readPointer(ptr(this.context.r9));
                                                                    var vmp_opcode_index = Memory.readPointer(data_buf);
                                                                    vmp_opcode_index = vmp_opcode_index & 0xFFFF;
                                                                    xor_key = vmp_opcode_index ^ xor_key ;
                                                                    console.log("vmp dex data xor key is :",ptr(xor_key));
                                                                }
                                                                var data_buff = Memory.readPointer(ptr(this.context.r9));
                                                                var vmp_opcode_data = Memory.readPointer(data_buff);
                                                                vmp_opcode_data = vmp_opcode_data & 0xFF;
                                                                var vmp_opcode_index = this.context.r1;
                                                                vmp_opcode_index = vmp_opcode_index & 0xFF;
                                                                console.log("");
                                                                console.log("vmp fun data is :\n", hexdump(data_buff,{length:0x10}));
                                                                console.log("vmp opcode data is :",ptr(vmp_opcode_data));
                                                                vmp_dex_data.push(ptr(vmp_opcode_data));
                                                                console.log("vmp opcode index is :",ptr(vmp_opcode_index));
                                                                vmp_opcode_index_v.push(ptr(vmp_opcode_index));
                                                                dex_code_len = parseInt(this.context.r2)- temp;
                                                                temp = parseInt(this.context.r2);
                                                            }
                                                        },
                                                        onLeave:function (retval) {
                                                            if(GetOpcode_flag == 1){
                                                                console.log("vmp opcode is:",ptr(this.context.r0));
                                                                vmp_opcode_v.push(ptr(this.context.r0));
                                                                console.log("dex code len :",dex_code_len);
                                                                vmp_code_len.push(dex_code_len);
                                                                console.log("");
                                                            }
                                                        }
                                                    })
                                                }
                                                vmp_hook = 1;
                                            }
                                        }
 
                                    }
                                }
                            },
 
                            onLeave: function (retval) {
                                if (this.funname != undefined) {
                                    console.log("Call_fun_end-->", this.funname);
                                    if(this.funname == "onCreate"){
                                        console.log("The onCreate VMP end!");
                                        console.log("");
                                        console.log("The onCreate VMP run info :");
                                        console.log("vmp_opcode_data :\n",vmp_dex_data);
                                        console.log("vmp_opcode_index_v:\n",vmp_opcode_index_v);
                                        console.log("vmp_opcode_v:\n",vmp_opcode_v);
                                        console.log("vmp_code_len:\n",vmp_code_len);
                                        console.log("====================================================================");
                                        str_flag = 0;
                                        GetOpcode_flag = 0;
                                        get_vmp_data_base = 0;
                                        temp = 0;
                                        vmp_opcode_index_v = [];
                                        vmp_opcode_v = [];
                                        vmp_code_len = [];
                                        vmp_dex_data = [];
                                    }
                                    k = 0;
                                }
                            }
                        })
                    }
 
                }
            },
            onLeave: function (retval) {
 
            }
        });
    }
 
    ishook_libart = true;
}
 
hook_libart();