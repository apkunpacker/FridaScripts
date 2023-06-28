# FridaScripts
This repository contains a collection of Frida scripts for various purposes, designed to aid in the analysis, debugging, and security research of Android applications.

## Script List

1. **AntiDebug.js:**
   It implements several anti (debugging, Frida, Xposed, screenshot, and VPN) detection bypass techniques.
2. **Billing.js**
   It implements logic to redirect google play purchase popup to some other app which can handle purchase like Lucky-Patcher.
3. **ClipBoard.js:**
   It implements logic to dump the clipboard content into console, usecase to show that most of app don't have any protection against it.
4. **Dexprotector.js:**
   It implements logic to dump the dexprotector library when it opened first time in memory, as library's name depend upon pid of app, it require
   some additional logic.
5. **DumpDex.js:**
    It implements logic to dump the dynamic dex/s of various packer/protectors. It doesn't contain any logic to bypass anti(root/frida)
   so if your target app crash before dumping anything, Its up to you to bypass those detections first rather than blaming the frida.
6. **DumpSo.js:**
   It implements logic to dump any library when it opened first time in memory via andorid_dlopen_ext.
7. **EarlyJava.js:**
   It implements logic to view and hook the java classes which are loaded in early context. Some packer/protector load the classes dynamically and to hook those classes we need
   a hook point - thats the point libart.so.
8. **FileRead.js:**
   It implements logic to read any file from disk with help of Java file and BufferReader.
9. **FunctionCalled.js:**
   It implements stalker logic to log the address of function called with instruction **call**. Picked up from windows based script logic so this may not work on android.
10. **InMemoryDexClassLoader.js:**
   It implements logic to dump the dex/s from packer/protectors which make use of InMemoryDexClassLoader api.
11. **InstallerFix.js:**
   Some app refuse to run when they installed from 3rd party method instead of play store. This script aim to fake the installer name to play store so app will think it is installed from play store.
12. **Interceptor.replace.js:**
   When working with libc.so hooks, sometime we feel need of Interceptor.replace instead of Interceptor.attach. Added few of libc.so hook with Interceptor.replace to save time. Now we have chatGPT to do it automatically but these codes were written manually at that time.
13. **Json.js:**
   It implements logic to hook and logs arguments from various method of JsonObject class.
14. **Logcat.js**
   Sometime we need to see the logcat to find the logs or possible issue, for that purpose we already have logcat commandline tool or logcat apps from play store but it always not work as indented. Suppose we need the logs from com.log app , if we grep com.log in logcat there are strong possibility that it may skip other  important logs of same app.
   So to help in this case, this script is prepared. It hook all the java and native log classes so you won't miss any log from yout target app.
15. **NPStringFog.js:**
   It implements logic to hook and decrypt string of NP Manager string encryption.
16. **ProcessNameChange.js:**
   It implements logic to change the process name at runtime. Logic is given by Legend Darvincisec.
17. **SSLUnpinning.js:**
   SSL Unpinning script, collection of open source scripts and mixed into single one and fixed some bugs(Like void methods returning true in other's script)
18. **StopExit.js:**
   Some app exit/crash when abnormal envirunment is detected (Rooted/Frida/Tampering). It try to prevent the crash and shows the backtrace to pinpoint the crash point to better analysis

