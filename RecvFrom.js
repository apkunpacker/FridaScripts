Interceptor.attach(Module.findExportByName('libc.so', 'recvfrom'), {
    onEnter: function(args) {
        this.gargs = new Array(6);
        for (var i = 0; i < 6; i++) {
            this.gargs[i] = args[i];
        }
    },
    onLeave: function(retval) {
        var args = this.gargs;
        var sockfd = args[0].toInt32();
        var buf = args[1];
        var len = retval.toInt32();
        var dest_addr = args[4];
        if (dest_addr.equals(0)) {
            dest_addr = Memory.alloc(16);
            var addr_len = Memory.alloc(4);
            Memory.writeU32(addr_len, 16);
            var getpeername = new NativeFunction(Module.findExportByName(null, "getpeername"), "int", ["int", "pointer", "pointer"]);
            getpeername(sockfd, dest_addr, addr_len);
        }
        var sin_family = Memory.readU8(dest_addr.add(1));
        //	if (sin_family != 2) return;
        var sin_port = Memory.readU16(dest_addr.add(2));
        sin_port = ((sin_port & 0xff) << 8) | ((sin_port >> 8) & 0xff);
        var sin_addr = Memory.readU32(dest_addr.add(4));
        var sin_ip = (sin_addr & 0xff).toString() + '.' + ((sin_addr >> 8) & 0xff).toString() +
            '.' + ((sin_addr >> 16) & 0xff).toString() + '.' + ((sin_addr >> 24) & 0xff).toString();
        console.warn("recvfrom(sockfd=" + args[0] + ",buflen=" + len + ",family=" + sin_family +
            ",ip=" + sin_ip + ",port=" + sin_port + ")");
        console.log(hexdump(buf, {
            length: len,
            header: false
        }));
    }
})