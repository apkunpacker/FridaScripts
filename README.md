# FridaScripts
This repository contains a collection of Frida scripts for various purposes, designed to aid in the analysis, debugging, and security research of Android applications.

## Script List

1. **AntiDebug.js**
   It implements several anti (debugging, Frida, Xposed, screenshot, and VPN) detection bypass techniques.
2. **Billing.js**
   It implements logic to redirect google play purchase popup to some other app which can handle purchase like Lucky-Patcher.
3. **ClipBoard.js**
   It implements logic to dump the clipboard content into console, usecase to show that most of app don't have any protection against it.
4. **Dexprotector.js**
   It implements logic to dump the dexprotector library when it opened first time in memory, as library's name depend upon pid of app, it require
   some additional logic.
5. **DumpDex.js**
    It implements logic to dump the dynamic dex of various packer/protectors. It doesn't contain any logic to bypass anti(root/frida)
   so if your target app crash before dumping anything, Its up to you to bypass those detections first rather than blaming the frida.
