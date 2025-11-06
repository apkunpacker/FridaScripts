# 🛠️ FridaScripts:

This repository is a collection of **Frida scripts** for **Android security research and debugging**. Use these scripts to bypass protections, dump runtime components, and intercept key application functions.

---

## ✨ Core Capabilities

* **Anti-Defense:** Bypass anti-debugging, anti-Frida, and anti-tampering checks.
* **Dumping:** Extract dynamic **DEX files** and **SO libraries** from packers.
* **Network:** Perform universal **SSL/TLS Unpinning** (Native, OkHttp, Flutter).
* **Instrumentation:** Hook early Java classes and native library functions (`libc.so`, `libart.so`).

---

## 📜 Key Scripts example

| Script File | Primary Function |
| :--- | :--- |
| **`AntiDebug.js`** | Bypasses anti-debugging/Frida/Xposed/VPN checks. |
| **`SSLUnpinning.js`** | Universal SSL/TLS Pinning bypass. |
| **`DumpDex.js`** | Dumps dynamic DEX files from memory. |
| **`DumpSo.js`** | Dumps native SO libraries via `android_dlopen_ext`. |
| **`EarlyJava.js`** | Hooks Java classes loaded in the early context (`libart.so`). |
| **`InMemoryDexClassLoader.js`** | Dumps DEX files loaded via `InMemoryDexClassLoader`. |
| **`NPStringFog.js`** | Decrypts strings obfuscated by NP Manager. |
| **`Logcat.js`** | Hooks all logging classes for comprehensive log capture. |
| **`StopExit.js`** | Prevents app exit/crash on environment detection (Root/Frida). |
| **`FlutterSSL.js`** | Dedicated SSL Unpinning for Flutter apps. |
| **`InstallerFix.js`** | Fakes Google Play Store installer for bypass. |
| **`Spoof.ts`** | Spoofs Android properties to block device fingerprinting. |

---

## 🚀 Usage Example

To run a script on a plugged-in device:

```bash
frida -U -f [APP_PACKAGE_NAME] -l SSLUnpinning.js
```
