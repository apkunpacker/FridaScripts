
setTimeout(function(){
	Java.perform(function(){		
		var sock = Java.use("java.net.Socket");	
		var inetaddr = Java.use("java.net.InetAddress");		
		sock.bind.implementation = function(localAddress){
			console.log("Bind("+localAddress.toString()+")");
			sock.bind.call(this, localAddress);
		}			
		sock.connect.overload("java.net.SocketAddress").implementation = function(endPoint){
			console.log("Connect("+endPoint.toString()+")");
			sock.connect.overload("java.net.SocketAddress").call(this, endPoint);
		}				
		sock.connect.overload("java.net.SocketAddress", "int").implementation = function(endPoint, tmout){
			console.log("Connect["+endPoint.toString()+", Timeout: "+tmout+"]");         
			sock.connect.overload("java.net.SocketAddress", "int").call(this, endPoint, tmout);
		}		
		sock.getInetAddress.implementation = function(){
			var ret = sock.getInetAddress.call(this);
			console.log("GetInetAddress() = ",ret.toString());
			return ret;
		}     					
		sock.$init.overload("java.net.InetAddress", "int").implementation = function(inetAddress, port){
			console.log("new Socket('"+inetAddress.toString()+"', "+port+") called");
			this.$init.overload("java.net.InetAddress", "int").call(this, inetAddress, port);
		}
		sock.$init.overload("java.net.InetAddress", "int","java.net.InetAddress", "int").implementation = function(inetAddress, port, localInet, localPort){
			console.log("RemoteInet: '"+inetAddress.toString()+"', RemotePort"+port+", LocalInet: '"+localInet+"', LocalPort: "+localPort+")");
			this.$init.overload("java.net.InetAddress", "int","java.net.InetAddress", "int").call(this, inetAddress, port);
		}		
		sock.$init.overload("java.net.Proxy").implementation = function(proxy){
			console.log("Proxy: "+proxy.toString()+")");
			this.$init.overload("java.net.Proxy").call(this, proxy);
		}				
		sock.$init.overload("java.net.SocketImpl").implementation = function(si){
			console.log("SocketImpl: "+si.toString()+")");
			this.$init.overload("java.net.SocketImpl").call(this, si);
		}			
		sock.$init.overload("java.lang.String", "int", "java.net.InetAddress", "int").implementation = function(host,port, localInetAddress, localPort){
			console.log("Host: '"+host+"', RemPort: "+port+", LocalInet: '"+localInetAddress+"', localPort: "+localPort+")");
			this.$init.overload("java.lang.String", "int", "java.net.InetAddress", "int").call(this, si);
		}
		inetaddr.getByName.overload("java.lang.String").implementation = function (Name) {
	        var inetReturn = this.getByName(Name);
	        console.warn("Inet GetByName : ",Name ,"\nInetAddress ; ",inetReturn);
	        return inetReturn;
	    }
						
	});
},0);

		
	
		