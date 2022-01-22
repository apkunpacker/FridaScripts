const Libg = {
	init: function() {
		Libg.module = Process.findModuleByName('libg.so');
		Libg.size = Libg.module.size;
		Libg.begin = Libg.module.base;
		Libg.lib = Libg.begin;
		Libg.end = ptr(Libg.begin.toInt32() + Libg.size);
		
		Libg.AntiCheat = {};
		Libg.AntiCheat.addr = {};
		Libg.AntiCheat.addr.guard_callback = Libg.offset(0x3A9414);
	},
	offset: function(a) {
		return Libg.lib.add(a);
	}
};

const MemoryPatcher = {
	patch: function(pointer, arr) {
		Memory.protect(pointer, arr.length, "rwx");
		Memory.writeByteArray(pointer, arr);
	}
}

const ArxanPatcher = {
	init: function() {
		Interceptor.replace(Libg.AntiCheat.addr.guard_callback, new NativeCallback(function(t) {
			console.log("guard_callback(" + t + ") : " + this.returnAddress.sub(Libg.begin));
		}, 'void', ['int']));

		Interceptor.attach(Libg.offset(0x6ED940), function() { // Messaging::connect
			console.log("Messaging::connect - possible frida detection, bypassing.");
			this.context.r0 = 0;
			this.context.r3 = 0;
		});

		Interceptor.attach(Libg.offset(0x315248), function() { // createGameMain
			console.log("Arxan random jump address " + this.context.r0.sub(Libg.begin) + ", setting valid address!");
			this.context.r0 = Libg.offset(0x3152A0);
		});
		
		Interceptor.attach(Libg.offset(0x312150), function() { // createGameMain - getaddrinfo protection
			console.log("Arxan random jump address " + this.context.r0.sub(Libg.begin) + ", setting valid address!");
			this.context.r0 = Libg.offset(0x3152A0);
		});
		
		Interceptor.attach(Libg.offset(0x715C84), function() { // LoginMessage::encode
			console.log("Login: Arxan random jump address " + this.context.r0.sub(Libg.begin) + ", setting valid address!");
			this.context.r0 = Libg.offset(0x716AE4);
		});
		
		Interceptor.attach(Libg.offset(0x66821C), function() { // InputSystem::update
			console.log("InputSystem: random jump bypassed");
			this.context.r0 = Libg.offset(0x669178);
		});
		
		Interceptor.attach(Libg.offset(0x78D8C0), function() { // CombatHUD::ultiButtonActivated
			console.log("Ulti: random jump bypassed");
			this.context.r0 = Libg.offset(0x78DA9C);
		});
	}
};

const Core = {
	init: function() {
		Process.setExceptionHandler(function(trace) {
			console.error('EXCEPTION:', trace, trace.address);
			console.error('           Address:', trace.address + ' (' + trace.address.sub(Libg.begin) + ')');
			console.error('           LR:', trace.context.lr + ' (' + trace.context.lr.sub(Libg.begin) + ')');
			console.error('           LIBG:', Libg.begin);
			return false;
		});
		try {
			Libg.init();
			ArxanPatcher.init();
			console.log("Initialization complete");
		} catch (exc) {
			console.error('Initialization failed:', exc);
		}
	}
}

rpc.exports.init = Core.init;