var base = Module.findBaseAddress("libg.so");

var mallocPtr = Module.findExportByName("libc.so", "malloc");
var freePtr = Module.findExportByName("libc.so", "free")
var DebugMenuCtorPtr = 0x004BD40 + 1;
var GameModeAddResourcesToLoadPtr = 0x00A2BB0 + 1;
var ResourceListenerAddFilePtr = 0x01351B0 + 1;
var StageAddChildPtr = 0x013EEB0 + 1;
var StageRemoveChildPtr = 0x013EEC4 + 1;
var StageCtorPtr = 0x013D310 + 1;
var MoneyHudCtorPtr = 0x00705C0 + 1;
var HudUpdatePtr = 0x0068568 + 1;
var DebugMenuBaseUpdatePtr = 0x004CD84 + 1;
var StringCtorPtr = 0x010D15C + 1;
var ChatInputGlobalSendMessagePtr = 0x0041A94 + 1;
var DebugInfoCtorPtr = 0x0049C24 + 1;
var ToggleDebugMenuButtonButtonPressedPtr = 0x005016C + 1;

var malloc = new NativeFunction(mallocPtr, 'pointer', ['int']);
var free = new NativeFunction(freePtr, 'void', ['pointer']);
var fDebugMenuCtor = new NativeFunction(base.add(DebugMenuCtorPtr), "void", ["pointer"]);
var fDebugInfoCtor = new NativeFunction(base.add(DebugInfoCtorPtr), "void", ["pointer"]);
var fResourceListenerAddFile = new NativeFunction(base.add(ResourceListenerAddFilePtr), "void", ["pointer", "pointer"]);
var fStageAddChild = new NativeFunction(base.add(StageAddChildPtr), "int", ["pointer", "pointer"]);
var fStageRemoveChild = new NativeFunction(base.add(StageRemoveChildPtr), "int", ["pointer", "pointer"]);
var fDebugMenuBaseUpdate = new NativeFunction(base.add(DebugMenuBaseUpdatePtr), "int", ["pointer", "float"]);

let DEBUG_MENU = 1;
let INFO_MENU = 2;

var stage_address;
var chatLeave = 0;
var dptr;
var menuType = 0;
base.add(0x03A96D8).writeU8(1); //offline mode

var load = Interceptor.attach(base.add(GameModeAddResourcesToLoadPtr), {
	onEnter: function(args) {
		load.detach();
		fResourceListenerAddFile(args[1], base.add(0x030BB9A)); //load debug.sc
	}
});

var stage = Interceptor.attach(base.add(StageCtorPtr), {
	onEnter: function(args) {
		stage.detach();
		stage_address = args[0];
	}
});

var gameLoaded = Interceptor.attach(base.add(MoneyHudCtorPtr), {
	onEnter: function(args) {
		gameLoaded.detach();
		menuType = DEBUG_MENU;
		dptr = malloc(1000);
		fDebugMenuCtor(dptr);
		fStageAddChild(stage_address, dptr);
	}
});

var hudUpdate = Interceptor.attach(base.add(HudUpdatePtr), {
	onEnter: function(args) {
		if (menuType > 0){
			fDebugMenuBaseUpdate(dptr, 20);
		}
	}
});

var closeMenu = Interceptor.attach(base.add(ToggleDebugMenuButtonButtonPressedPtr), {
	onEnter: function(args) {
		switch(menuType) {
			case DEBUG_MENU:
				fStageRemoveChild(stage_address, dptr);
				free(dptr);
				menuType = 0;
				break;
			case INFO_MENU:
				fStageRemoveChild(stage_address, dptr);
				free(dptr);
				menuType = 0;
				break;
		}
	}
});

var sendMessage = Interceptor.attach(base.add(ChatInputGlobalSendMessagePtr), {
	onEnter: function(args) {
		chatLeave = 0;
		var executeCmd = Interceptor.attach(base.add(StringCtorPtr), {
			onEnter: function(args) {
				let cmd = args[1].readUtf8String();
				switch(cmd) {
					case "/menu":
						menuType = DEBUG_MENU;
						dptr = malloc(1000);
						fDebugMenuCtor(dptr);
						fStageAddChild(stage_address, dptr);
						executeCmd.detach();
					break;
					case "/debuginfo":
						menuType = INFO_MENU;
						dptr = malloc(1000);
						fDebugInfoCtor(dptr);
						fStageAddChild(stage_address, dptr);
						executeCmd.detach();
					break;
				}
				if(chatLeave === 1) {
					executeCmd.detach();
				}
			}
		});
	},
	onLeave: function(args) {
		chatLeave = 1;
	}
});
