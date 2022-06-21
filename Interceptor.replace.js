const fork_ptr = Module.getExportByName("libc.so", "fork");
const fork = new NativeFunction(fork_ptr, 'int', []);
Interceptor.replace(fork_ptr, new NativeCallback(function() {
    console.log("Fork Replaced");
    return -1;
    // return fork(); 
}, "int", []));
var removeptr = Module.getExportByName('libc.so', 'remove');
var remove = new NativeFunction(removeptr, 'int', ['pointer']);
Interceptor.replace(removeptr, new NativeCallback(function(path) {
    console.log('remove : ', path.readCString());
    return remove(path);
    //  return -1;
}, 'int', ['pointer']));
var p_pthread_create = Module.findExportByName("libc.so", "pthread_create");
var pthread_create = new NativeFunction(p_pthread_create, "int", ["pointer", "pointer", "pointer", "pointer"]);
Interceptor.replace(p_pthread_create, new NativeCallback(function(ptr0, ptr1, ptr2, ptr3) {
    if (ptr1.isNull() && ptr3.isNull()) {
        console.log("loading fake pthread_create because ptr1 and ptr3 are equal to 0!");
        return -1;
    } else {
        var ret = pthread_create(ptr0, ptr1, ptr2, ptr3);
        return ret;
    }
}, "int", ["pointer", "pointer", "pointer", "pointer"]));
var fgetsPtr = Module.findExportByName("libc.so", "fgets");
var fgets = new NativeFunction(fgetsPtr, 'pointer', ['pointer', 'int', 'pointer']);
Interceptor.replace(fgetsPtr, new NativeCallback(function(buffer, size, fp) {
    var retval = fgets(buffer, size, fp);
    var bufstr = buffer.readCString();
    /*
     if (bufstr.indexOf("TracerPid:") > -1) {
         buffer.writeUtf8String("TracerPid:\t0");
           console.log("Bypassing TracerPID Check");               
     }
     */
    if (bufstr.indexOf("frida") > -1) {
        console.log("Frida in Buffer", retval);
        // var newstr = bufstr.replaceAll("frida", "libcc");
        // buffer.writeUtf8String(newstr);
        // console.error(bufstr);
        return retval;
    }
    return retval;
}, 'pointer', ['pointer', 'int', 'pointer']))
var fopenPtr = Module.findExportByName("libc.so", "fopen");
var fopen = new NativeFunction(fopenPtr, 'pointer', ['pointer', 'pointer']);
Interceptor.replace(fopenPtr, new NativeCallback(function(path, mode) {
    var retval = fopen(path, mode);
    var ch = path.readCString();
    if (ch.indexOf("/proc/") >= 0 && ch.indexOf("maps") >= 0) {
        //  path.writeUtf8String("/proc/self/mounts");
        console.log("fopen : ", path.readCString());
        //  return fopen(path, mode);
    }
    console.log("fopen : ", path.readCString())
    return retval;
}, 'pointer', ['pointer', 'pointer']))
var inet_atonPtr = Module.findExportByName("libc.so", "inet_aton");
var inet_aton = new NativeFunction(inet_atonPtr, 'int', ['pointer', 'pointer']);
Interceptor.replace(inet_atonPtr, new NativeCallback(function(addrs, structure) {
    var retval = inet_aton(addrs, structure);
    console.log("inet_aton : ", addrs.readCString())
    return retval;
}, 'int', ['pointer', 'pointer']))
var connectPtr = Module.findExportByName("libc.so", "connect");
var connect = new NativeFunction(connectPtr, 'int', ['int', 'pointer', 'int']);
Interceptor.replace(connectPtr, new NativeCallback(function(fd, addr, len) {
    var retval = connect(fd, addr, len);
    // var family = addr.readU16();
    //var port = addr.add(2).readU16();
    //  port = ((port & 0xff) << 8) | (port >> 8);
    //console.warn(family,port);                                       
    //  return retval;
    return retval;
}, 'int', ['int', 'pointer', 'int']))
var sendtoPtr = Module.findExportByName("libc.so", "sendto");
var sendto = new NativeFunction(sendtoPtr, 'int', ['int', 'pointer', 'int', 'int', 'pointer', 'int']);
Interceptor.replace(sendtoPtr, new NativeCallback(function(socksfd, msg, slen, flag, daddr, dlen) {
    var retval = sendto(socksfd, msg, slen, flag, daddr, dlen);
    //console.warn(socksfd,msg.readCString(),slen,flag,daddr,dlen);                                       
    return retval;
}, 'int', ['int', 'pointer', 'int', 'int', 'pointer', 'int']))
var opendirPtr = Module.findExportByName("libc.so", "opendir");
var opendir = new NativeFunction(opendirPtr, 'pointer', ['pointer']);
Interceptor.replace(opendirPtr, new NativeCallback(function(path) {
    var retval = opendir(path);
    console.log("opendir : ", path.readCString())
    return retval;
}, 'pointer', ['pointer']))
var lstatPtr = Module.findExportByName("libc.so", "lstat");
var lstat = new NativeFunction(lstatPtr, 'int', ['pointer', 'pointer']);
Interceptor.replace(lstatPtr, new NativeCallback(function(path, structure) {
    var retval = lstat(path, structure);
    console.log("lstat : ", path.readCString())
    return retval;
}, 'int', ['pointer', 'pointer']))
var popenPtr = Module.findExportByName("libc.so", "popen");
var popen = new NativeFunction(popenPtr, 'pointer', ['pointer', 'pointer']);
Interceptor.replace(popenPtr, new NativeCallback(function(path, type) {
    var retval = popen(path, type);
    console.log("popen : ", path.readCString());
    return retval;
}, 'pointer', ['pointer', 'pointer']))
var symlinkPtr = Module.findExportByName("libc.so", "symlink");
var symlink = new NativeFunction(symlinkPtr, 'int', ['pointer', 'pointer']);
Interceptor.replace(symlinkPtr, new NativeCallback(function(target, path) {
    var retval = symlink(target, path);
    console.log("symlink: ", target.readCString(), path.readCString());
    return retval;
}, 'int', ['pointer', 'pointer']))
var symlinkatPtr = Module.findExportByName("libc.so", "symlinkat");
var symlinkat = new NativeFunction(symlinkatPtr, 'int', ['pointer', 'int', 'pointer']);
Interceptor.replace(symlinkatPtr, new NativeCallback(function(target, fd, path) {
    var retval = symlinkat(target, fd, path);
    console.log("symlinkat : ", target.readCString(), path.readCString());
    return retval;
}, 'int', ['pointer', 'int', 'pointer']))
var socketPtr = Module.findExportByName("libc.so", "socket");
var socket = new NativeFunction(socketPtr, 'int', ['int', 'int', 'int']);
Interceptor.replace(socketPtr, new NativeCallback(function(domain, type, proto) {
    var retval = socket(domain, type, proto);
    console.warn("socket : ", domain, type, proto)
    return retval;
   // return -1;
}, 'int', ['int', 'int', 'int']))
var getsockoptPtr = Module.findExportByName("libc.so", "getsockopt");
var getsockopt = new NativeFunction(getsockoptPtr, 'int', ['int', 'int', 'int', 'pointer', 'pointer']);
Interceptor.replace(getsockoptPtr, new NativeCallback(function(sockfd, level, optname, optval, optlen) {
    var retval = getsockopt(sockfd, level, optname, optval, optlen);
    console.warn("getsockopt : ", sockfd, level, optname, optval, optlen)
    return retval;
    // return -1;
}, 'int', ['int', 'int', 'int', 'pointer', 'pointer']))
var setsockoptPtr = Module.findExportByName("libc.so", "setsockopt");
var setsockopt = new NativeFunction(setsockoptPtr, 'int', ['int', 'int', 'int', 'pointer', 'pointer']);
Interceptor.replace(setsockoptPtr, new NativeCallback(function(sockfd, level, optname, optval, optlen) {
    var retval = setsockopt(sockfd, level, optname, optval, optlen);
    console.warn("setsockopt : ", sockfd, level, optname, optval, optlen)
    return retval;
    // return -1
}, 'int', ['int', 'int', 'int', 'pointer', 'pointer']))
var inet_addrPtr = Module.findExportByName("libc.so", "inet_addr");
var inet_addr = new NativeFunction(inet_addrPtr, 'int', ['int']);
Interceptor.replace(inet_addrPtr, new NativeCallback(function(path) {
    var retval = inet_addr(path);
    console.log("inet_addr : ", path.readCString())
    return retval;
   // return -1
}, 'int', ['int']))
var openPtr = Module.findExportByName("libc.so", "open");
var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
Interceptor.replace(openPtr, new NativeCallback(function(pathname, flag) {
    var retval = open(pathname, flag);
    var ch = pathname.readCString();
    if (ch.indexOf("/data/") < 0 && ch.indexOf("/apex/") < 0 && ch.indexOf("/system/") < 0 && ch.indexOf("/my_heytap/") < 0 && ch.indexOf("/product/") < 0 && ch.indexOf("/my_product/") < 0 && ch.indexOf("/vendor/") < 0 && ch.indexOf("/my_stock/") < 0) {
        // pathname.writeUtf8String("/proc/self/mounts");   
        console.log("open : ", pathname.readCString())
        //return open(pathname, flag); 
    }
    //console.log("open : ",pathname.readCString()) 
    return retval;
}, 'int', ['pointer', 'int']))
var openatPtr = Module.findExportByName("libc.so", "openat");
var openat = new NativeFunction(openatPtr, 'int', ['int', 'pointer', 'int']);
Interceptor.replace(openatPtr, new NativeCallback(function(dirfd, path, flag) {
    var retval = openat(dirfd, path, flag);
    console.warn("openat : ", path.readCString());
    return retval;
    // return -1;
}, 'int', ['int', 'pointer', 'int']))
var readlinkPtr = Module.findExportByName("libc.so", "readlink");
var readlink = new NativeFunction(readlinkPtr, 'int', ['pointer', 'pointer', 'int']);
Interceptor.replace(readlinkPtr, new NativeCallback(function(pathname, buf, bufsize) {
    var retval = readlink(pathname, buf, bufsize);
    console.warn("readlink : ", pathname.readCString(), retval);
    return retval;
    //   return 0xffffffff;
}, 'int', ['pointer', 'pointer', 'int']))
var readlinkatPtr = Module.findExportByName("libc.so", "readlinkat");
var readlinkat = new NativeFunction(readlinkatPtr, 'int', ['int', 'pointer', 'pointer', 'int']);
Interceptor.replace(readlinkatPtr, new NativeCallback(function(dirfd, pathname, buf, bufsize) {
    var retval = readlinkat(dirfd, pathname, buf, bufsize);
    console.warn("readlinkat : ", pathname.readCString(), retval);
    return retval;
    //return 0xffffffff;
}, 'int', ['int', 'pointer', 'pointer', 'int']))
var sendPtr = Module.findExportByName("libc.so", "send");
var send2 = new NativeFunction(sendPtr, 'int', ['int', 'pointer', 'int', 'int']);
Interceptor.replace(sendPtr, new NativeCallback(function(socksfd, msg, slen, flag, daddr, dlen) {
    var retval = send2(socksfd, msg, slen, flag);
    console.log(socksfd, msg, slen, flag);
    return retval;
}, 'int', ['int', 'pointer', 'int', 'int']))
