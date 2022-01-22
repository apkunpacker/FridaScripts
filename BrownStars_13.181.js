function hexStringToByte(str) {
    if (!str) {
        return new Uint8Array();
    }

    var a = [];
    for (var i = 0, len = str.length; i < len; i += 2) {
        a.push(parseInt(str.substr(i, 2), 16));
    }

    return new Uint8Array(a);
}

const SHA256 = "731a29e80b7ca89c7e9b39d381821ee8dccd1b0456782f788650945e7d60d8d3"; //SHA Digest

Java.perform(function () {
	const MessageDigest = Java.use("java.security.MessageDigest");
	const Str = Java.use("java.lang.String");
	
	MessageDigest.digest.overload('[B').implementation = function(a1) {
		console.log("digest");
		var digraw = hexStringToByte(SHA256);
		var jaw = Java.array('byte', digraw);
		return jaw;
	}
});

// global cache
var cache = {
    modules: {},
    options: {}
};

//libc native functions
var malloc = new NativeFunction(Module.findExportByName('libc.so', 'malloc'), 'pointer', ['int']);
var free = new NativeFunction(Module.findExportByName('libc.so', 'free'), 'void', ['pointer']);
var pthread_mutex_lock = new NativeFunction(Module.findExportByName('libc.so', 'pthread_mutex_lock'), 'int', ['pointer']);
var pthread_mutex_unlock = new NativeFunction(Module.findExportByName('libc.so', 'pthread_mutex_unlock'), 'int', ['pointer']);
var pthread_cond_signal = new NativeFunction(Module.findExportByName('libc.so', 'pthread_cond_signal'), 'int', ['pointer']);
var select = new NativeFunction(Module.findExportByName('libc.so', 'select'), 'int', ['int', 'pointer', 'pointer', 'pointer', 'pointer']);
var memmove = new NativeFunction(Module.findExportByName('libc.so', 'memmove'), 'pointer', ['pointer', 'pointer', 'int']);
var ntohs = new NativeFunction(Module.findExportByName('libc.so', 'ntohs'), 'uint16', ['uint16']);
var inet_addr = new NativeFunction(Module.findExportByName('libc.so', 'inet_addr'), 'int', ['pointer']);
var libc_send = new NativeFunction(Module.findExportByName('libc.so', 'send'), 'int', ['int', 'pointer', 'int', 'int']);
var libc_recv = new NativeFunction(Module.findExportByName('libc.so', 'recv'), 'int', ['int', 'pointer', 'int', 'int']);

const SERVER_CONNECTION = 0xC68300;
const PTHREAD_COND_WAKE_RETURN = 0x7D2AFE + 8 + 1;
const CREATE_MESSAGE_BY_TYPE = 0x2FEF24;
const NEW_OPERATOR = 0x7F4944 + 1;
const WAKEUP_RETURN_ARRAY = [0x11897C, 0x12B21C, 0x21080C, 0x2AE020, 0x4923B4, 0x64BC54];
const SELECT_RETURN = 0x29573C;
const CHECK = 0xB5030;
const ON_RECEIVE = 0x363FD4;
const POINTER_SIZE = 4;

// logic helpers
var Message = {
    _getByteStream: function(message) {
        return message.add(8);
    },
    _getVersion: function(message) {
        return Memory.readInt(message.add(4));
    },
    _setVersion: function(message, version) {
		try {
			Memory.writeInt(message.add(4), version);
		} catch(error) {
        }
    },
    _getMessageType: function(message) {
        return (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(20)), 'int', ['pointer']))(message);
    },
    _encode: function(message) {
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(8)), 'void', ['pointer']))(message);
    },
    _decode: function(message) {
		try {
			(new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(12)), 'void', ['pointer']))(message);
		} catch(error) {
        }
    },
    _free: function(message) {
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(24)), 'void', ['pointer']))(message);
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(4)), 'void', ['pointer']))(message);
    }
};
var ByteStream = {
    _getOffset: function(byteStream) {
        return Memory.readInt(byteStream.add(16));
    },
    _getByteArray: function(byteStream) {
        return Memory.readPointer(byteStream.add(28));
    },
    _setByteArray: function(byteStream, array) {
		try {
			Memory.writePointer(byteStream.add(28), array);
		} catch(error) {
        }
    },
    _getLength: function(byteStream) {
        return Memory.readInt(byteStream.add(20));
    },
    _setLength: function(byteStream, length) {
		try {
			Memory.writeInt(byteStream.add(20), length);
		} catch(error) {
        }
    }
};
var Buffer = {
    _getEncodingLength: function(buffer) {
        return Memory.readU8(buffer.add(2)) << 16 | Memory.readU8(buffer.add(3)) << 8 | Memory.readU8(buffer.add(4));
    },
    _setEncodingLength: function(buffer, length) {
        Memory.writeU8(buffer.add(2), length >> 16 & 0xFF);
        Memory.writeU8(buffer.add(3), length >> 8 & 0xFF);
        Memory.writeU8(buffer.add(4), length & 0xFF);
    },
    _setMessageType: function(buffer, type) {
        Memory.writeU8(buffer.add(0), type >> 8 & 0xFF);
        Memory.writeU8(buffer.add(1), type & 0xFF);
    },
    _getMessageVersion: function(buffer) {
        return Memory.readU8(buffer.add(5)) << 8 | Memory.readU8(buffer.add(6));
    },
    _setMessageVersion: function(buffer, version) {
        Memory.writeU8(buffer.add(5), version >> 8 & 0xFF);
        Memory.writeU8(buffer.add(6), version & 0xFF);
    },
    _getMessageType: function(buffer) {
        return Memory.readU8(buffer) << 8 | Memory.readU8(buffer.add(1));
    }
};
var MessageQueue = {
    _getCapacity: function(queue) {
        return Memory.readInt(queue.add(4));
    },
    _get: function(queue, index) {
        return Memory.readPointer(Memory.readPointer(queue).add(POINTER_SIZE * index));
    },
    _set: function(queue, index, message) {
        Memory.writePointer(Memory.readPointer(queue).add(POINTER_SIZE * index), message);
    },
    _count: function(queue) {
        return Memory.readInt(queue.add(8));
    },
    _decrementCount: function(queue) {
        Memory.writeInt(queue.add(8), Memory.readInt(queue.add(8)) - 1);
    },
    _incrementCount: function(queue) {
        Memory.writeInt(queue.add(8), Memory.readInt(queue.add(8)) + 1);
    },
    _getDequeueIndex: function(queue) {
        return Memory.readInt(queue.add(12));
    },
    _getEnqueueIndex: function(queue) {
        return Memory.readInt(queue.add(16));
    },
    _setDequeueIndex: function(queue, index) {
        Memory.writeInt(queue.add(12), index);
    },
    _setEnqueueIndex: function(queue, index) {
        Memory.writeInt(queue.add(16), index);
    },
    _enqueue: function(queue, message) {
        pthread_mutex_lock(queue.sub(4));
        var index = MessageQueue._getEnqueueIndex(queue);
        MessageQueue._set(queue, index, message);
        MessageQueue._setEnqueueIndex(queue, (index + 1) % MessageQueue._getCapacity(queue));
        MessageQueue._incrementCount(queue);
        pthread_mutex_unlock(queue.sub(4));
    },
    _dequeue: function(queue) {
        var message = null;
        pthread_mutex_lock(queue.sub(4));
        if (MessageQueue._count(queue)) {
            var index = MessageQueue._getDequeueIndex(queue);
            message = MessageQueue._get(queue, index);
            MessageQueue._setDequeueIndex(queue, (index + 1) % MessageQueue._getCapacity(queue));
            MessageQueue._decrementCount(queue);
        }
        pthread_mutex_unlock(queue.sub(4));
        return message;
    }
};


function setupMessaging() {
	cache.base = Module.findBaseAddress("libg.so");
	cache.sett = 1;
	console.log("Base");
	cache.pthreadReturn = cache.base.add(PTHREAD_COND_WAKE_RETURN);
	cache.wakeUpReturnArray = [];
    for (var i = 0; i < WAKEUP_RETURN_ARRAY.length; i += 1) {
        cache.wakeUpReturnArray.push(cache.base.add(WAKEUP_RETURN_ARRAY[i]));
    }
    cache.serverConnection = Memory.readPointer(cache.base.add(SERVER_CONNECTION));
    cache.messaging = Memory.readPointer(cache.serverConnection.add(4));
	console.log(cache.messaging);
    cache.messageFactory = Memory.readPointer(cache.messaging.add(52));
	console.log(cache.messageFactory);
    cache.recvQueue = cache.messaging.add(60);
    cache.sendQueue = cache.messaging.add(84);
    cache.state = cache.messaging.add(208);
    cache.loginMessagePtr = cache.messaging.add(212);
	cache.createMessageByType = new NativeFunction(cache.base.add(CREATE_MESSAGE_BY_TYPE), 'pointer', ['pointer', 'int']);
	cache.selectReturn = cache.base.add(SELECT_RETURN);
	cache.newOperator = new NativeFunction(cache.base.add(NEW_OPERATOR), 'pointer', ['int']);
	console.log(Memory.readByteArray(cache.serverConnection, 40));
	console.log(Memory.readByteArray(cache.messaging, 40));
	
	console.log(cache.messaging);
	
	cache.sendMessage = function (message) {
		var messageType = Message._getMessageType(message);
		Message._encode(message);
        var byteStream = Message._getByteStream(message);
        var messagePayloadLength = ByteStream._getOffset(byteStream);
        var messageBuffer = malloc(messagePayloadLength + 7);
        memmove(messageBuffer.add(7), ByteStream._getByteArray(byteStream), messagePayloadLength);
        Buffer._setEncodingLength(messageBuffer, messagePayloadLength);
        Buffer._setMessageType(messageBuffer, Message._getMessageType(message));
        Buffer._setMessageVersion(messageBuffer, Message._getVersion(message));
        libc_send(cache.fd, messageBuffer, messagePayloadLength + 7, 0);
        free(messageBuffer);
    };
	
	function onWakeup() {
		var message = MessageQueue._dequeue(cache.sendQueue);
        while (message) {
            var messageType = Message._getMessageType(message);
			console.log(messageType);
			if (messageType === 10100) {
				message = Memory.readPointer(cache.loginMessagePtr);
                Memory.writePointer(cache.loginMessagePtr, ptr(0));
				//patchReceive();
			}
            cache.sendMessage(message);
            message = MessageQueue._dequeue(cache.sendQueue);
        }
	};
	
	function onReceive() {
        var headerBuffer = cache.newOperator(7);
        libc_recv(cache.fd, headerBuffer, 7, 256);
        var messageType = Buffer._getMessageType(headerBuffer);
        if (messageType > 20000 && messageType < 30000) {
            var payloadLength = Buffer._getEncodingLength(headerBuffer);
            var messageVersion = Buffer._getMessageVersion(headerBuffer);
            free(headerBuffer);
            var messageBuffer = cache.newOperator(payloadLength);
            libc_recv(cache.fd, messageBuffer, payloadLength, 256);
            var message = cache.createMessageByType(cache.messageFactory, messageType);
            Message._setVersion(message, messageVersion);
            var byteStream = Message._getByteStream(message);
            ByteStream._setLength(byteStream, payloadLength);
            if (payloadLength) {
                var byteArray = cache.newOperator(payloadLength);
                memmove(byteArray, messageBuffer, payloadLength);
                ByteStream._setByteArray(byteStream, byteArray);
            }
            Message._decode(message);
            MessageQueue._enqueue(cache.recvQueue, message);    
            if (messageType === 20104) {
                Memory.writeInt(cache.state, 5);
				hackProtections();
            }
            free(messageBuffer);        
        }
    };
	
	var checks;
	
	function hackProtections() {
		Interceptor.replace(cache.base.add(ON_RECEIVE), new NativeCallback(function(a1, a2) {
        }, 'void', ['int', 'int']));
		checks = Interceptor.attach(cache.base.add(CHECK), function() {
            this.context.r0 = 0x02;
		});
	}
	
	Interceptor.replace(Module.findExportByName('libc.so', 'pthread_cond_signal'), new NativeCallback(function(a1) {
        if(!this.returnAddress.equals(cache.pthreadReturn)) {
            return pthread_cond_signal(a1);
        }
        var sp4 = Memory.readPointer(this.context.sp.add(4));
        for (var i = 0; i < cache.wakeUpReturnArray.length; i += 1) {
            if (sp4.equals(cache.wakeUpReturnArray[i])) {
                onWakeup();
                return 0;
            }
        }
        return pthread_cond_signal(a1);
    }, 'int', ['pointer']));
	
	//function patchReceive() {
		Interceptor.replace(Module.findExportByName('libc.so', 'select'), new NativeCallback(function(nfds, readfds, writefds, exceptfds, timeout) {
			console.log("selection");
			var r = select(nfds, readfds, writefds, exceptfds, timeout);
			if (this.returnAddress.equals(cache.selectReturn)) {
				console.log("selected");
				onReceive();
			}
			return r;
		}, 'int', ['int', 'pointer', 'pointer', 'pointer', 'pointer']));
	//}
}


function setup() {
	Interceptor.attach(Module.findExportByName('libc.so', 'connect'), {
		onEnter: function(args) {
		if (ntohs(Memory.readU16(args[1].add(2))) === 9339) {
			cache.fd = args[0].toInt32();
			console.log("Connecting to 9339...");
			var host = Memory.allocUtf8String("192.168.0.100");
			Memory.writeInt(args[1].add(4), inet_addr(host));
			setupMessaging();
			}
		}
	});
}

// startup
rpc.exports = {
    init: function(stage, options) {
        cache.options = options || {};
		Interceptor.detachAll();
		setup();
    }
};
