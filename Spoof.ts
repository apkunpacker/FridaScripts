import Java from "frida-java-bridge"

function Randomizer() {
    function generateRandomDeviceId() {
        var chars = 'abcdef0123456789';
        var id = '';
        for (var i = 0; i < 16; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    function generateRandomBatteryLevel() {
        return Math.floor(Math.random() * 101);
    }

    function generateRandomTemperature() {
        return Math.floor(Math.random() * 200) + 200;
    }

    function generateRandomVoltage() {
        return Math.floor(Math.random() * 1000) + 3000;
    }

    function generateRandomCurrent() {
        return Math.floor(Math.random() * 2000) + 500;
    }

    function generateRandomCapacity() {
        return Math.floor(Math.random() * 2000) + 2000;
    }

    function generateRandomChargeCounter() {
        return Math.floor(Math.random() * 3000000) + 1000000;
    }

    function generateRandomChargeTime() {
        return Math.floor(Math.random() * 3600000) + 300000;
    }

    function randomName() {
        const names = ["Nexus", "Galaxy", "Pixel", "OnePlus", "Moto", "Redmi"];
        return names[Math.floor(Math.random() * names.length)] + "_" + Math.floor(Math.random() * 10000);
    }

    function randomBool() {
        return Math.random() < 0.5;
    }

    function randomState() {
        return Math.floor(Math.random() * 4) * 10;
    }

    function randomString(length: number) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    function randomBrand() {
        const brands = ["Samsung", "Apple", "Huawei", "Xiaomi", "Sony", "LG", "Google", "OnePlus", "Motorola", "Nokia", "HTC", "BlackBerry", "Lenovo", "Oppo", "Vivo", "ASUS", "ZTE", "Alcatel", "TCL", "Realme", "Meizu", "Micromax", "Panasonic"];
        return brands[Math.floor(Math.random() * brands.length)];
    }

    function randomTags() {
        const tags = ["release-keys", "dev-keys"];
        return tags[Math.floor(Math.random() * tags.length)];
    }

    function randomType() {
        const types = ["user", "release", "eng"];
        return types[Math.floor(Math.random() * types.length)];
    }

    function randomFingerprint(brand: string, device: string) {
        return brand.toLowerCase() + "/" + device + "/" + device + ":" +
            "11/" + randomString(10) + "/" + Math.floor(Math.random() * 1000000) + ":user/" + randomTags();
    }

    function randomSocManufacturer() {
        const manufacturers = ["Qualcomm", "MediaTek", "Samsung", "Google", "HiSilicon"];
        return manufacturers[Math.floor(Math.random() * manufacturers.length)];
    }

    function randomSocModel() {
        return "SM" + randomString(4);
    }

    function randomMAC() {
        let mac = "";
        const hex = "0123456789ABCDEF";
        for (let i = 0; i < 6; i++) {
            mac += hex.charAt(Math.floor(Math.random() * 16));
            mac += hex.charAt(Math.floor(Math.random() * 16));
            if (i < 5) mac += ":";
        }
        return mac;
    }


    function randomInterfaceName() {
        const base = ["wlan", "eth", "rmnet", "ccmni", "usb", "en", "lo"];
        return base[Math.floor(Math.random() * base.length)] + Math.floor(Math.random() * 100);
    }

    function randomSSID() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
        const length = Math.floor(Math.random() * 8) + 5;
        let ssid = "";
        for (let i = 0; i < length; i++) {
            ssid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return ssid.trim();
    }

    function DRMSystemID() {
        const characters = '0123456789';
        var serialNumber = '';
        for (var i = 0; i < 10; i++) {
            serialNumber += characters[Math.floor(Math.random() * characters.length)];
        }
        return serialNumber;
    }

    function generateRandomUUID() {
        var chars = '0123456789abcdef';
        var uuid = '';
        for (var i = 0; i < 32; i++) {
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += chars[Math.floor(Math.random() * chars.length)];
        }
        return uuid;
    }



    function generateRandomDRMProperty(prop: any) {
        const properties = {
            'vendor': ['Google', 'Samsung', 'Qualcomm', 'MediaTek', 'Huawei'],
            'version': ['1.0', '1.1', '1.2', '1.3', '1.4', '2.0'],
            'description': ['Hardware DRM', 'Software DRM', 'Secure DRM'],
            'algorithms': ['AES/CBC/PKCS7Padding', 'AES/CTR/PKCS7Padding'],
            'maxHdcpLevel': ['1', '2', '3'],
            'maxNumberOfSessions': ['16', '32', '64'],
            'usageReportingSupport': ['true', 'false'],
            'provisioningUniqueId': [DRMSystemID()],
            'serviceCertificate': [DRMSystemID()]
        };
        const keys = Object.keys(properties) as Array<keyof typeof properties>;
        for (const key of keys) {
            if (prop.toLowerCase().includes(key.toLowerCase())) {
                const propertyValues = properties[key];
                return propertyValues[Math.floor(Math.random() * propertyValues.length)];
            }
        }
        return DRMSystemID();
    }
    return {
        generateRandomDeviceId: generateRandomDeviceId,
        generateRandomBatteryLevel: generateRandomBatteryLevel,
        generateRandomTemperature: generateRandomTemperature,
        generateRandomVoltage: generateRandomVoltage,
        generateRandomCurrent: generateRandomCurrent,
        generateRandomCapacity: generateRandomCapacity,
        generateRandomChargeCounter: generateRandomChargeCounter,
        generateRandomChargeTime: generateRandomChargeTime,
        randomMAC: randomMAC,
        randomInterfaceName: randomInterfaceName,
        randomSSID: randomSSID,
        randomName: randomName,
        randomBool: randomBool,
        randomState: randomState,
        randomString: randomString,
        randomBrand: randomBrand,
        randomTags: randomTags,
        randomType: randomType,
        randomSocManufacturer: randomSocManufacturer,
        randomSocModel: randomSocModel,
        randomFingerprint: randomFingerprint,
        DRMSystemID: DRMSystemID,
        generateRandomUUID: generateRandomUUID,
        generateRandomDRMProperty: generateRandomDRMProperty
    };
}


Java.performNow(function () {

    /*
        Spoof AndroidID related calls
    */

    try {
        var Secure = Java.use("android.provider.Settings$Secure");
        Secure.getStringForUser.overload('android.content.ContentResolver', 'java.lang.String', 'int').implementation = function (resolver: any, name: string, user: any) {
            if (name.toLowerCase().indexOf("android_id") !== -1) {
                var spoofed = Randomizer().generateRandomDeviceId();
                console.log("Spoofed android_id (getStringForUser):", spoofed);
                return spoofed;
            }
            return this.getStringForUser(resolver, name, user);
        };
        Secure.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function (resolver: any, name: string) {
            if (name.toLowerCase().indexOf("android_id") !== -1) {
                var spoofed = Randomizer().generateRandomDeviceId();
                console.log("Spoofed android_id (Secure.getString):", spoofed);
                return spoofed;
            }
            return this.getString(resolver, name);
        };
    } catch (e) {
        console.log("Error hooking Secure.getString* :", e);
    }
    try {
        var System = Java.use("android.provider.Settings$System");
        System.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function (resolver: any, name: string) {
            if (name.toLowerCase().indexOf("android_id") !== -1) {
                var spoofed = Randomizer().generateRandomDeviceId();
                console.log("Spoofed android_id (System.getString):", spoofed);
                return spoofed;
            }
            return this.getString(resolver, name);
        };
    } catch (e) {
        console.log("Error hooking System.getString:", e);
    }
    try {
        var Global = Java.use("android.provider.Settings$Global");
        Global.getString.overload('android.content.ContentResolver', 'java.lang.String').implementation = function (resolver: any, name: string) {
            if (name.toLowerCase().indexOf("android_id") !== -1) {
                var spoofed = Randomizer().generateRandomDeviceId();
                console.log("Spoofed android_id (Global.getString):", spoofed);
                return spoofed;
            }
            return this.getString(resolver, name);
        };
    } catch (e) {
        console.log("Error hooking Global.getString:", e);
    }


    /*
        Spoof battery related checks like health, temperature, % of charged,status etc
    */


    try {
        var PowerProfile = Java.use("com.android.internal.os.PowerProfile");
        PowerProfile.getBatteryCapacity.implementation = function () {
            var randomCapacity = 2000 + Math.random() * 3000;
            console.log("Random Battery Capacity: " + randomCapacity);
            return randomCapacity;
        };
    } catch (e) {
        console.log("Error hooking getBatteryCapacity: " + e);
    }
    try {
        var BatteryManager = Java.use("android.os.BatteryManager");
        BatteryManager.isPlugWired.overload("int").implementation = function (i: any) {
            var original = this.isPlugWired(i);
            var spoof = Math.random() > 0.5;
            console.log("Spoofing isPlugWired - Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.queryProperty.overload("int").implementation = function (id: any) {
            var original = this.queryProperty(id);
            var spoof: number;
            switch (id) {
                case 1:
                    spoof = Randomizer().generateRandomChargeCounter();
                    break;
                case 2:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 3:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 4:
                    spoof = Randomizer().generateRandomBatteryLevel();
                    break;
                case 5:
                    spoof = Randomizer().generateRandomChargeCounter() * 1000;
                    break;
                case 6:
                    spoof = Math.floor(Math.random() * 5) + 1;
                    break;
                default:
                    spoof = Math.floor(Math.random() * 10000);
            }
            console.log("Spoofing queryProperty - ID:", id, "Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.computeChargeTimeRemaining.overload().implementation = function () {
            var original = this.computeChargeTimeRemaining();
            var spoof = Randomizer().generateRandomChargeTime();
            console.log("Spoofing computeChargeTimeRemaining - Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.getIntProperty.overload("int").implementation = function (id: any) {
            var original = this.getIntProperty(id);
            var spoof: number;
            switch (id) {
                case 1:
                    spoof = Randomizer().generateRandomChargeCounter();
                    break;
                case 2:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 3:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 4:
                    spoof = Randomizer().generateRandomBatteryLevel();
                    break;
                case 5:
                    spoof = Randomizer().generateRandomChargeCounter() * 1000;
                    break;
                case 6:
                    spoof = Math.floor(Math.random() * 5) + 1;
                    break;
                default:
                    spoof = Math.floor(Math.random() * 10000);
            }
            console.log("Spoofing getIntProperty - ID:", id, "Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.getLongProperty.overload("int").implementation = function (id: any) {
            var original = this.getLongProperty(id);
            var spoof: number;
            switch (id) {
                case 1:
                    spoof = Randomizer().generateRandomChargeCounter();
                    break;
                case 2:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 3:
                    spoof = Randomizer().generateRandomCurrent();
                    break;
                case 4:
                    spoof = Randomizer().generateRandomCapacity();
                    break;
                case 5:
                    spoof = Randomizer().generateRandomChargeCounter() * 1000;
                    break;
                case 6:
                    spoof = Math.floor(Math.random() * 5) + 1;
                    break;
                default:
                    spoof = Math.floor(Math.random() * 100000);
            }
            console.log("Spoofing getLongProperty - ID:", id, "Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.isCharging.overload().implementation = function () {
            var original = this.isCharging();
            var spoof = Math.random() > 0.3;
            console.log("Spoofing isCharging - Original:", original, "Spoofed:", spoof);
            return spoof;
        }
        BatteryManager.setChargingStateUpdateDelayMillis.overload("int").implementation = function (delayMillis: any) {
            var spoof = Math.floor(Math.random() * 10000) + 1000;
            console.log("Spoofing setChargingStateUpdateDelayMillis - Original:", delayMillis, "Spoofed:", spoof);
            return this.setChargingStateUpdateDelayMillis(spoof);
        }
        try {
            var Intent = Java.use("android.content.Intent");
            Intent.getIntExtra.overload("java.lang.String", "int").implementation = function (name: string, defaultValue: any) {
                var original = this.getIntExtra(name, defaultValue);
                if (name === "level") {
                    var spoof = Randomizer().generateRandomBatteryLevel();
                    console.log("Spoofing battery level intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                } else if (name === "temperature") {
                    var spoof = Randomizer().generateRandomTemperature();
                    console.log("Spoofing battery temperature intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                } else if (name === "voltage") {
                    var spoof = Randomizer().generateRandomVoltage();
                    console.log("Spoofing battery voltage intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                } else if (name === "status") {
                    var spoof = Math.floor(Math.random() * 5) + 1;
                    console.log("Spoofing battery status intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                } else if (name === "health") {
                    var spoof = Math.floor(Math.random() * 7) + 1;
                    console.log("Spoofing battery health intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                } else if (name === "plugged") {
                    var spoof = Math.floor(Math.random() * 4);
                    console.log("Spoofing battery plugged intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                }
                return original;
            }
            Intent.getStringExtra.overload("java.lang.String").implementation = function (name: string) {
                var original = this.getStringExtra(name);
                if (name === "technology") {
                    var technologies = ["Li-ion", "Li-poly", "NiMH", "NiCd"];
                    var spoof = technologies[Math.floor(Math.random() * technologies.length)];
                    console.log("Spoofing battery technology intent - Original:", original, "Spoofed:", spoof);
                    return spoof;
                }
                return original;
            }
        } catch (e) {
            console.log("Intent battery hooks not available:", e);
        }
    } catch (e) {
        console.error("Error in BatteryManager hooks:", e);
    }
    /*
        Spoof/Null bluetooth related methods
    */
    try {
        const BluetoothAdapter = Java.use('android.bluetooth.BluetoothAdapter');
        BluetoothAdapter.getBondedDevices.implementation = function () {
            console.log("Spoofed: BluetoothAdapter.getBondedDevices");
            return Java.use('java.util.HashSet').$new();
        };
        BluetoothAdapter.getState.implementation = function () {
            const state = Randomizer().randomState();
            console.log("Spoofed: BluetoothAdapter.getState -> " + state);
            return state;
        };
        BluetoothAdapter.startDiscovery.implementation = function () {
            const result = Randomizer().randomBool();
            console.log("Spoofed: BluetoothAdapter.startDiscovery -> " + result);
            return result;
        };
        BluetoothAdapter.isDiscovering.implementation = function () {
            const result = Randomizer().randomBool();
            console.log("Spoofed: BluetoothAdapter.isDiscovering -> " + result);
            return result;
        };
        BluetoothAdapter.isEnabled.implementation = function () {
            const result = Randomizer().randomBool();
            console.log("Spoofed: BluetoothAdapter.isEnabled -> " + result);
            return result;
        };
        BluetoothAdapter.getBluetoothLeAdvertiser.implementation = function () {
            console.log("Spoofed: BluetoothAdapter.getBluetoothLeAdvertiser -> null");
            return null;
        };
        BluetoothAdapter.getBluetoothLeScanner.implementation = function () {
            console.log("Spoofed: BluetoothAdapter.getBluetoothLeScanner -> null");
            return null;
        };
        BluetoothAdapter.getRemoteDevice.overload('[B').implementation = function (bytes: any) {
            console.log("Spoofed: BluetoothAdapter.getRemoteDevice(byte[]) -> null");
            return null;
        };
        BluetoothAdapter.getRemoteDevice.overload('java.lang.String').implementation = function (address: any) {
            console.log("Spoofed: BluetoothAdapter.getRemoteDevice(String) -> null");
            return null;
        };
        BluetoothAdapter.getRemoteLeDevice.implementation = function (address: any, type: any) {
            console.log("Spoofed: BluetoothAdapter.getRemoteLeDevice -> null");
            return null;
        };
        BluetoothAdapter.getDefaultAdapter.implementation = function () {
            console.log("Spoofed: BluetoothAdapter.getDefaultAdapter -> original", this.getDefaultAdapter());
            return this.getDefaultAdapter();
        };
        BluetoothAdapter.getName.implementation = function () {
            const name = Randomizer().randomName();
            console.log("Spoofed: BluetoothAdapter.getName -> " + name);
            return name;
        };
        BluetoothAdapter.getAddress.implementation = function () {
            const btMac = Randomizer().randomMAC();
            console.log("Spoofed: Bluetooth MAC Address: " + btMac);
            return btMac;
        };
    } catch (err1) {
        console.error("BluetoothAdapter hook error:", err1);
    }
    /*
        Build info spoofing
    */
    const spoofValues = {
        BOARD: Randomizer().randomString(10).toLowerCase(),
        BOOTLOADER: Randomizer().randomString(10).toLowerCase(),
        BRAND: Randomizer().randomBrand(),
        DEVICE: Randomizer().randomString(8).toLowerCase(),
        DISPLAY: Randomizer().randomString(12),
        HARDWARE: Randomizer().randomString(8).toLowerCase(),
        HOST: Randomizer().randomString(8),
        ID: Randomizer().randomString(8),
        MANUFACTURER: Randomizer().randomBrand(),
        MODEL: Randomizer().randomBrand() + " " + Randomizer().randomString(5),
        PRODUCT: Randomizer().randomString(10).toLowerCase(),
        SERIAL: Randomizer().randomString(10),
        TAGS: Randomizer().randomTags(),
        TYPE: Randomizer().randomType(),
        USER: Randomizer().randomString(6),
        RADIO: Randomizer().randomString(12),
        TIME: Date.now(),
        IS_DEBUGGABLE: false,
        IS_EMULATOR: false,
        IS_ENG: false,
        IS_USER: true,
        IS_USERDEBUG: false,
        PERMISSIONS_REVIEW_REQUIRED: true,
        SOC_MANUFACTURER: Randomizer().randomSocManufacturer(),
        SOC_MODEL: Randomizer().randomSocModel(),
        UNKNOWN: Randomizer().randomString(10),
        SKU: Randomizer().randomString(10),
        ODM_SKU: Randomizer().randomString(4)
    } as any;

    const brandForFingerprint = spoofValues.BRAND.toLowerCase().replace(/\s/g, '');
    spoofValues.FINGERPRINT = `${brandForFingerprint}/${spoofValues.DEVICE}/${spoofValues.DEVICE}:11/${Randomizer().randomString(10)}/${Math.floor(Math.random() * 1000000)}:${spoofValues.TYPE}/${spoofValues.TAGS}`;
    try {
        const Build = Java.use("android.os.Build");
        for (const field in spoofValues) {
            if (Object.prototype.hasOwnProperty.call(spoofValues, field)) {
                try {
                    const originalValue = Build[field].value;
                    Build[field].value = spoofValues[field];
                    console.log(`Spoofed ${field}: ${originalValue} -> ${spoofValues[field]}`);
                } catch (e) {
                    console.error(`Error spoofing ${field}. It might not exist or is immutable: ${e}`);
                }
            }
        }
    } catch (e) {
        console.error("Build class spoofing error:", e);
    }
    /*
        Few CPU info hooks
    */
    try {
        var FileReader = Java.use("java.io.FileReader");
        FileReader.$init.overload('java.lang.String').implementation = function (path: any) {
            if (path.includes("cpuinfo")) {
                console.log("Spoofing /proc/cpuinfo");
                this.$init.call(this, "/dev/null");
            } else {
                this.$init.call(this, path);
            }
        };
        var FileApi = Java.use("java.io.File");
        FileApi.$init.overload('java.lang.String').implementation = function (path: any) {
            if (path.includes("/sys/devices/system/cpu/") || path.includes("/sys/devices/virtual/thermal")) {
                console.log("Blocking CPU and Thermal info", path);
                this.$init.call(this, "/dev/null");
            } else {
                this.$init.call(this, path);
            }
        };
    } catch (e) {
        console.error("Error CPU Info :", e)
    }

    /*
        DRM hooks
    */

    try {
        var DRM = Java.use("android.media.MediaDrm");
        var UUID = Java.use("java.util.UUID");
        DRM.getPropertyString.overload('java.lang.String').implementation = function (prop: any) {
            var original = this.getPropertyString(prop);
            var spoof: string;
            if (prop.includes("securityLevel")) {
                spoof = Math.random() > 0.5 ? "L1" : "L3";
            } else if (prop.includes("systemId")) {
                spoof = Randomizer().DRMSystemID();
            } else {
                spoof = Randomizer().generateRandomDRMProperty(prop);
            }
            console.log("Spoofing DRM property:", original, "->", spoof);
            return spoof;
        }
        //Spoofing UUID Break most of DRM stuff :)
        DRM.getByteArrayFromUUID.overload('java.util.UUID').implementation = function (uuid: {
            toString: () => any;
        }) {
            var randomUUIDString = Randomizer().generateRandomUUID();
            var randomUUID = UUID.fromString(randomUUIDString);
            console.log("DRM Spoofing UUID:", uuid.toString(), "->", randomUUIDString);
            return this.getByteArrayFromUUID(randomUUID);
        }
        DRM.isCryptoSchemeSupported.overload('java.util.UUID').implementation = function (uuid: any) {
            var original = this.isCryptoSchemeSupported(uuid);
            var spoof = Math.random() > 0.2;
            console.log("DRM isCryptoSchemeSupported :", "Original :", original, "-> Spoof :", spoof);
            return spoof;
        }
        DRM.isCryptoSchemeSupportedNative.overload('[B', 'java.lang.String', 'int').implementation = function (uuidBytes: any, mimeType: any, securityLevel: any) {
            var original = this.isCryptoSchemeSupportedNative(uuidBytes, mimeType, securityLevel);
            var spoof = Math.random() > 0.2;
            console.log("DRM isCryptoSchemeSupportedNative :", "Original :", original, "-> Spoof :", spoof);
            return spoof ? true : false;
        }
        DRM.getMaxHdcpLevel.overload().implementation = function () {
            var spoof = Math.floor(Math.random() * 10) + 1;
            console.log("DRM getMaxHdcpLevel Spoof :", spoof);
            return spoof;
        }
    } catch (e) {
        console.error("Error in DRM hooks:", e);
    }

    /*
        Location Spoof hooks
    */

    try {
        const LocationSpoofer = {
            generateRandomCoordinates: function () {
                return {
                    latitude: Math.random() * 180 - 90,
                    longitude: Math.random() * 360 - 180,
                    altitude: Math.random() * 1000,
                    accuracy: 1.0
                };
            }
        };
        const Location = Java.use("android.location.Location");
        const LocationManager = Java.use("android.location.LocationManager");
        Location.getLatitude.implementation = function () {
            const newLocation = LocationSpoofer.generateRandomCoordinates();
            console.log("Spoofing Latitude:", newLocation.latitude.toFixed(6));
            return newLocation.latitude;
        };
        Location.getLongitude.implementation = function () {
            const newLocation = LocationSpoofer.generateRandomCoordinates();
            console.log("Spoofing Longitude:", newLocation.longitude.toFixed(6));
            return newLocation.longitude;
        };
        Location.getAltitude.implementation = function () {
            const newLocation = LocationSpoofer.generateRandomCoordinates();
            console.log("Spoofing Altitude:", newLocation.altitude.toFixed(2));
            return newLocation.altitude;
        };
        Location.getAccuracy.implementation = function () {
            const newAccuracy = 2000000;
            console.log("Spoofing Accuracy: 2,000,000");
            return newAccuracy;
        };
        LocationManager.getLastKnownLocation.overload('java.lang.String').implementation = function (provider: any) {
            const newLocation = LocationSpoofer.generateRandomCoordinates();
            const spoofedLocation = Location.$new(provider);
            spoofedLocation.setLatitude(newLocation.latitude);
            spoofedLocation.setLongitude(newLocation.longitude);
            spoofedLocation.setAltitude(newLocation.altitude);
            spoofedLocation.setAccuracy(newLocation.accuracy);
            spoofedLocation.setTime(Date.now());
            console.log("Spoofing getLastKnownLocation for provider:", provider, "-> Lat:", newLocation.latitude.toFixed(6), "Lon:", newLocation.longitude.toFixed(6));
            return spoofedLocation;
        };
    } catch (error) {
        console.error("Error in location spoofing script:", error);
    }

    /*
        Network spoofs
    */

    try {
        const NetworkInterface = Java.use("java.net.NetworkInterface");
        const Collections = Java.use("java.util.Collections");
        const ArrayList = Java.use("java.util.ArrayList");
        const WifiInfo = Java.use('android.net.wifi.WifiInfo');
        NetworkInterface.getHardwareAddress.overload().implementation = function () {
            const spoofed = Randomizer().randomMAC();
            console.log("Spoofed getHardwareAddress:", spoofed);
            const byteArray = Java.array('byte', spoofed.split(":").map(s => parseInt(s, 16)));
            return byteArray;
        };
        NetworkInterface.getName.implementation = function () {
            const spoofed = Randomizer().randomInterfaceName();
            console.log("Spoofed getName:", spoofed);
            return spoofed;
        };
        NetworkInterface.getDisplayName.implementation = function () {
            const spoofed = Randomizer().randomInterfaceName();
            console.log("Spoofed getDisplayName:", spoofed);
            return spoofed;
        };
        NetworkInterface.getNetworkInterfaces.overload().implementation = function () {
            const original = this.getNetworkInterfaces();
            const spoofedList = ArrayList.$new();
            const numInterfaces = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numInterfaces; i++) {
                if (original.hasMoreElements()) {
                    spoofedList.add(original.nextElement());
                } else {
                    break;
                }
            }
            console.log(`Spoofing getNetworkInterfaces: Returning an enumeration with ${spoofedList.size()} random interfaces.`);
            return Collections.enumeration(spoofedList);
        };
        WifiInfo.getMacAddress.implementation = function () {
            const mac = Randomizer().randomMAC();
            console.log("Spoofed Wifi MAC Address: " + mac);
            return mac;
        };
        WifiInfo.getSSID.implementation = function () {
            const ssid = Randomizer().randomSSID();
            console.log("Spoofed Wifi SSID: " + ssid);
            return ssid;
        };
        WifiInfo.getBSSID.implementation = function () {
            const bssid = Randomizer().randomMAC();
            console.log("Spoofed Wifi BSSID: " + bssid);
            return bssid;
        };
    } catch (e) {
        console.error("Error hooking network information:", e);
    }
    /*
        Sensor hooks
    */
    try {
        var Sensor = Java.use("android.hardware.Sensor");
        var SensorManager = Java.use("android.hardware.SensorManager");
        var ArrayList = Java.use("java.util.ArrayList");

        function getRandomInt(min: number, max: number) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getRandomLong() {
            return Java.use("java.util.Random").$new().nextLong();
        }
        try {
            var Sensor = Java.use("android.hardware.Sensor");
            Sensor.setType.implementation = function (type: any) {
                try {
                    var randomType = getRandomInt(1, 100);
                    console.log("Spoofed Sensor.setType with: " + randomType);
                    return this.setType(randomType);
                } catch (e) {
                    console.log("Error in setType: " + e);
                    return this.setType(type);
                }
            };
            Sensor.setId.implementation = function (id: any) {
                try {
                    var randomId = getRandomInt(1000, 9999);
                    console.log("Spoofed Sensor.setId with: " + randomId);
                    return this.setId(randomId);
                } catch (e) {
                    console.log("Error in setId: " + e);
                    this.setId(id);
                }
            };
            Sensor.setUuid.implementation = function (uuid_lsb: any, uuid_msb: any) {
                try {
                    var randomLsb = getRandomLong();
                    var randomMsb = getRandomLong();
                    console.log("Spoofed Sensor.setUuid with: " + randomLsb + ", " + randomMsb);
                    return this.setUuid.call(this, randomLsb, randomMsb);
                } catch (e) {
                    console.log("Error in setUuid: " + e);
                    this.setUuid(uuid_lsb, uuid_msb);
                }
            };
        } catch (e) {
            console.log("Error in hooking Sensor methods: " + e);
        }
        var sensorNames = [
            "Accelerometer", "Gyroscope", "Magnetometer", "Proximity Sensor",
            "Light Sensor", "Barometer", "Temperature Sensor", "Humidity Sensor",
            "Step Detector", "Step Counter", "Gravity Sensor", "Linear Acceleration",
            "Rotation Vector", "Orientation Sensor", "Heart Rate Sensor",
            "Ambient Temperature", "Pressure Sensor", "Relative Humidity Sensor",
            "Significant Motion Sensor", "Game Rotation Vector"
        ];
        var sensorVendors = ["Google", "Samsung", "Sony", "HTC", "Oppo", "Huawei", "Xiaomi", "OnePlus", "LG"];

        function randomFromArray(arr: string | any[]) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function createFakeSensor(type: any) {
            var fakeSensor = Java.cast(Java.use("android.hardware.Sensor").class.newInstance(), Sensor);
            fakeSensor.getName.implementation = function () {
                return randomFromArray(sensorNames) + " Sensor";
            };
            fakeSensor.getVendor.implementation = function () {
                return randomFromArray(sensorVendors);
            };
            fakeSensor.getVersion.implementation = function () {
                return Math.floor(Math.random() * 10) + 1;
            };
            fakeSensor.getType.implementation = function () {
                return type;
            };
            fakeSensor.getMaximumRange.implementation = function () {
                return Math.random() * 1000;
            };
            fakeSensor.getResolution.implementation = function () {
                return Math.random();
            };
            fakeSensor.getPower.implementation = function () {
                return Math.random();
            };
            fakeSensor.getMinDelay.implementation = function () {
                return Math.floor(Math.random() * 100000);
            };
            return fakeSensor;
        }
        SensorManager.getSensorList.overload('int').implementation = function (type: string) {
            var fakeSensorList = ArrayList.$new();
            var count = Math.floor(Math.random() * 40) + 1;
            for (var i = 0; i < count; i++) {
                fakeSensorList.add(createFakeSensor(type));
            }
            console.log("Hooked getSensorList with " + count + " random sensors for type: " + type);
            return fakeSensorList;
        };
        SensorManager.getDefaultSensor.overload('int').implementation = function (type: string) {
            var sensor = createFakeSensor(type);
            console.log("Hooked getDefaultSensor with random sensor for type: " + type);
            return sensor;
        };
    } catch (e) {
        console.log("Hooking SensorManager methods failed: " + e);
    }
    /*
    Telephony manager spoof hooks
    */
    const usaOperators = ["AT&T", "Verizon", "T-Mobile", "Sprint", "US Cellular", "Cricket Wireless", "Metro by T-Mobile", "Boost Mobile", "Tracfone", "Virgin Mobile", "Google Fi", "Visible", "Straight Talk", "Net10 Wireless", "Total Wireless", "Consumer Cellular", "Republic Wireless", "Red Pocket Mobile", "Ultra Mobile", "Mint Mobile"];
    const indianOperators = ["Airtel", "Vodafone Idea", "Reliance Jio", "BSNL (Bharat Sanchar Nigam Limited)", "MTNL (Mahanagar Telephone Nigam Limited)", "Tata Docomo", "Aircel", "Idea Cellular", "Uninor", "Videocon Mobile", "Telenor", "MTS (Mobile TeleSystems)", "BSNL Mobile", "Jio Fiber", "ACT Fibernet", "Hathway", "Tikona", "Reliance Communications", "Loop Mobile", "Spice Telecom"];
    const Countries = ["US", "CN", "IN", "BR", "RU", "ID", "NG", "PK", "MX", "JP", "DE", "BD", "FR", "PH", "EG", "TR", "IT", "ZA", "KR", "AR"];
    const countryCodes = ["us", "cn", "in", "br", "ru", "id", "ng", "pk", "mx", "jp", "de", "bd", "fr", "ph", "eg", "tr", "it", "za", "kr", "ar"];
    const phoneNumbers = ["1234567890", "9876543210", "5551234567", "8009876543", "7776665555", "4441112222", "9998887777", "3334445566", "6667778888", "2223334444"];

    function getRandomName(namesArray: string | any[]) {
        const randomIndex = Math.floor(Math.random() * namesArray.length);
        return namesArray[randomIndex];
    }

    function GetRandomID() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    function generateSerial() {
        const numericPart = Math.floor(100000000000000000 + Math.random() * 900000000000000000);
        const lastCharacter = Math.floor(Math.random() * 6) + 10;
        const specialString = numericPart.toString() + lastCharacter.toString(16).toUpperCase();
        return specialString;
    }

    function generateRandomMccMnc() {
        const length = Math.floor(Math.random() * 2) + 5;
        var mccMnc = '';
        for (var i = 0; i < length; i++) {
            mccMnc += Math.floor(Math.random() * 10);
        }
        return mccMnc;
    }

    function generateRandomDeviceId() {
        const characters = '123456789abcdef';
        var deviceId = '';
        deviceId += characters.charAt(Math.floor(Math.random() * (characters.length - 1)) + 1);
        for (var i = 1; i < 16; i++) {
            deviceId += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return deviceId;
    }

    function generateRandomPhoneBrand() {
        const phoneBrands = ["Samsung", "Apple", "Huawei", "Xiaomi", "Sony", "LG", "Google", "OnePlus", "Motorola", "Nokia", "HTC", "BlackBerry", "Lenovo", "Oppo", "Vivo", "ASUS", "ZTE", "Alcatel", "TCL"];
        const randomIndex = Math.floor(Math.random() * phoneBrands.length);
        return phoneBrands[randomIndex];
    }

    function generateRandomIMEI() {
        const firstDigit = Math.floor(Math.random() * 9) + 1;
        const remainingDigits = Array.from({
            length: 14
        }, () => Math.floor(Math.random() * 10)).join('');
        const imei = `${firstDigit}${remainingDigits}`;
        return imei;
    }


    function generateRandomMEID() {
        var chars = '0123456789ABCDEF';
        var meid = '';
        for (var i = 0; i < 14; i++) {
            meid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return meid;
    }

    function generateRandomFID() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        var fid = '';
        for (var i = 0; i < 22; i++) {
            fid += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return fid;
    }

    function getRandomNumber() {
        return Math.floor(Math.random() * 50) + 1;
    }


    function generateRandomGUID() {
        var chars = '0123456789abcdef';
        var guid = '';
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                guid += '-';
            } else if (i === 14) {
                guid += '4';
            } else if (i === 19) {
                guid += chars.charAt(Math.floor(Math.random() * 4) + 8);
            } else {
                guid += chars.charAt(Math.floor(Math.random() * 16));
            }
        }
        return guid;
    }

    function generateRandomPhoneNumber() {
        return getRandomName(phoneNumbers);
    }

    function generateRandomMcc() {
        return Math.floor(100 + Math.random() * 900).toString();
    }

    function generateRandomMnc() {
        return Math.floor(10 + Math.random() * 90).toString();
    }

    function generateRandomCarrierId() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    function getRandomOperator() {
        var allOperators = usaOperators.concat(indianOperators);
        return getRandomName(allOperators);
    }
    var TManager = Java.use("android.telephony.TelephonyManager");
    var SInfo = Java.use("android.telephony.SubscriptionInfo");
    var ServiceState = Java.use("android.telephony.ServiceState");
    try {
        TManager.getSimCountryIso.overload().implementation = function () {
            var spoof = getRandomName(Countries);
            console.log("Spoofing getSimCountryIso :", spoof, this.getSimCountryIso())
            return spoof;
        }
        TManager.getSimState.overload().implementation = function () {
            var spoof = getRandomNumber();
            console.log("Spoofing getSimState :", spoof, this.getSimState())
            return spoof;
        }
        TManager.getSimState.overload().implementation = function () {
            var spoof = getRandomNumber();
            console.log("Spoofing getSimState :", spoof, this.getSimState())
            return spoof;
        }
        TManager.getSimOperatorName.overload().implementation = function () {
            var spoof = getRandomOperator()
            console.log("Spoofing getSimOperatorName :", spoof)
            return spoof;
        }
        TManager.getSimOperatorNameForPhone.overload("int").implementation = function (i: any) {
            var spoof = getRandomOperator()
            console.log("Spoofing getSimOperatorNameForPhone :", spoof)
            return spoof;
        }
        TManager.getSimCarrierId.overload().implementation = function () {
            var spoof = GetRandomID();
            console.log("Spoofing getSimCarrierId :", spoof)
            return spoof;
        }
        TManager.getSimCountryIsoForPhone.overload("int").implementation = function (code: any) {
            var spoof = getRandomName(Countries);
            console.log("Spoofing getSimCountryIsoForPhone :", spoof)
            return spoof;
        }
        TManager.getSimSerialNumber.overload().implementation = function () {
            var spoof = generateSerial();
            console.log("Spoofing getSimSerialNumber:", spoof)
            return spoof;
        }
        TManager.getSimOperator.overload().implementation = function () {
            var spoof = generateRandomMccMnc();
            console.log("Spoofing getSimOperator :", spoof)
            return spoof;
        }
        TManager.getSimOperatorNumericForPhone.overload("int").implementation = function (code: any) {
            var spoof = generateRandomMccMnc();
            console.log("Spoofing getSimOperatorNumericForPhone :", spoof)
            return spoof;
        }
        TManager.getSimOperatorNumeric.overload().implementation = function () {
            var spoof = generateRandomMccMnc();
            console.log("Spoofing getSimOperatorNumeric :", spoof)
            return spoof;
        }
        TManager.getNetworkOperator.overload().implementation = function () {
            var spoof = '"' + generateRandomMccMnc() + '"';
            console.log("Spoofing getNetworkOperator :", spoof)
            return spoof.toString();
        }
        TManager.getNetworkOperatorName.overload().implementation = function () {
            var spoof = getRandomOperator();
            console.log("Spoofing getNetworkOperatorName :", spoof)
            return spoof;
        }
        TManager.getDeviceId.overload().implementation = function () {
            var spoof = generateRandomDeviceId()
            console.log("Spoofing getDeviceId :", spoof)
            return spoof;
        }
        TManager.getSubscriberId.overload().implementation = function () {
            var spoof = generateRandomDeviceId()
            console.log("Spoofing getSubscriberId :", spoof)
            return spoof;
        }
        TManager.getTelephonyProperty.overload('java.lang.String', 'java.lang.String').implementation = function (str1: any, str2: any) {
            var spoof = generateRandomPhoneBrand();
            console.log("Spoofing getTelephonyProperty :", spoof)
            return spoof;
        }
        TManager.getTelephonyProperty.overload('int', 'java.lang.String', 'java.lang.String').implementation = function (ints: any, str1: any, str2: any) {
            var spoof = generateRandomPhoneBrand();
            console.log("Spoofing getTelephonyProperty :", spoof)
            return spoof;
        }
        TManager.getNetworkOperatorForPhone.overload("int").implementation = function (code: any) {
            var spoof = generateRandomMccMnc();
            console.log("Spoofing getNetworkOperatorForPhone :", spoof)
            return spoof;
        }
        TManager.getNetworkCountryIso.overload().implementation = function () {
            var spoof = getRandomOperator()
            console.log("Spoofing getNetworkCountryIso :", spoof)
            return spoof;
        }
        TManager.getServiceStateForSubscriber.overload("int").implementation = function (code: string) {
            var state = ServiceState.$new();
            var randomState = Math.floor(Math.random() * 4);
            state.setState(randomState);
            console.log("Random ServiceState for getServiceStateForSubscriber " + code + ": " + randomState);
            return state;
        };
        TManager.getPhoneType.overload("int").implementation = function (code: any) {
            var spoof = GetRandomID();
            console.log("Spoofing getPhoneType :", spoof)
            return spoof;
        }
        TManager.getPhoneType.overload().implementation = function () {
            var spoof = GetRandomID();
            console.log("Spoofing getPhoneType :", spoof)
            return spoof;
        }
        TManager.getImei.overload().implementation = function () {
            var spoof = generateRandomIMEI();
            console.log("Spoofing getImei :", spoof)
            return spoof;
        }
        TManager.getImei.overload("int").implementation = function (vl: any) {
            var spoof = generateRandomIMEI();
            console.log("Spoofing getImei2 :", spoof)
            return spoof;
        }

        TManager.getMeid.overload().implementation = function () {
            var spoofed = generateRandomMEID();
            console.log("Spoofed MEID:", spoofed);
            return spoofed;
        };
        TManager.getMeid.overload('int').implementation = function (slotIndex: any) {
            var spoofed = generateRandomMEID();
            console.log("Spoofed MEID for slot", slotIndex + ":", spoofed);
            return spoofed;
        };
        TManager.getDeviceId.overload('int').implementation = function (slotIndex: any) {
            var spoofed = generateRandomMEID();
            console.log("Spoofed DeviceId/MEID for slot", slotIndex + ":", spoofed);
            return spoofed;
        };

    } catch (e) {
        console.error("TManager :", e);
    }
    try {
        SInfo.getCountryIso.overload().implementation = function () {
            var spoof = getRandomName(countryCodes);
            console.log("Spoofing getCountryIso :", spoof)
            return spoof;
        }
        SInfo.getNumber.overload().implementation = function () {
            var spoof = generateRandomPhoneNumber();
            console.log("Spoofing getNumber :", spoof);
            return spoof;
        }
        SInfo.getMncString.overload().implementation = function () {
            var spoof = generateRandomMnc();
            console.log("Spoofing getMncString :", spoof)
            return spoof;
        }
        SInfo.getMccString.overload().implementation = function () {
            var spoof = generateRandomMcc();
            console.log("Spoofing getMccString :", spoof)
            return spoof;
        }
        SInfo.getCarrierId.overload().implementation = function () {
            var spoof = generateRandomCarrierId();
            console.log("Spoofing getCarrierId :", spoof);
            return spoof;
        }
        SInfo.getCarrierName.overload().implementation = function () {
            var newcarrier = getRandomOperator();
            console.log("Spoofing getCarrierName :", newcarrier);
            return Java.use("java.lang.String").$new(newcarrier);
        }
        SInfo.getIccId.overload().implementation = function () {
            var spoof = generateSerial();
            console.log("Spoofing getIccId :", spoof);
            return spoof;
        }
        SInfo.getSubscriptionId.overload().implementation = function () {
            var spoof = generateRandomCarrierId();
            console.log("Spoofing getSubscriptionId :", spoof);
            return spoof;
        }
        SInfo.getSimSlotIndex.overload().implementation = function () {
            var spoof = Math.floor(Math.random() * 2);
            console.log("Spoofing getSimSlotIndex :", spoof);
            return spoof;
        }
        SInfo.getDisplayName.overload().implementation = function () {
            var spoof = getRandomOperator();
            console.log("Spoofing getDisplayName :", spoof);
            return Java.use("java.lang.String").$new(spoof);
        }
    } catch (e) {
        console.error("sinfo :", e);
    }

    /*
        Few random hooks
    */

    try {
        var FirebaseInstallations = Java.use("com.google.firebase.installations.FirebaseInstallations");
        FirebaseInstallations.getId.implementation = function () {
            var Task = Java.use("com.google.android.gms.tasks.Tasks");
            var spoofedFID = generateRandomFID();
            console.log("Spoofed Firebase Installation ID:", spoofedFID);
            return Task.forResult(spoofedFID);
        };
    } catch (e) {
        console.error("Firebase Installations not found:", e);
    }
    try {
        var FirebaseInstanceId = Java.use("com.google.firebase.iid.FirebaseInstanceId");
        FirebaseInstanceId.getId.implementation = function () {
            var spoofed = generateRandomFID();
            console.log("Spoofed Firebase Instance ID:", spoofed);
            return spoofed;
        };
        FirebaseInstanceId.getToken.overload().implementation = function () {
            var spoofed = generateRandomFID();
            console.log("Spoofed Firebase Token:", spoofed);
            return spoofed;
        };
    } catch (e) {
        console.error("Firebase Instance ID not found:", e);
    }
    try {
        var UUID = Java.use("java.util.UUID");
        UUID.randomUUID.implementation = function () {
            var spoofedGUID = generateRandomGUID();
            console.log("Spoofed UUID.randomUUID:", spoofedGUID);
            return UUID.fromString(spoofedGUID);
        };
    } catch (e) {
        console.error("Error hooking UUID:", e);
    }
    try {
        var AdvertisingIdClient = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient");
        var Info = Java.use("com.google.android.gms.ads.identifier.AdvertisingIdClient$Info");
        AdvertisingIdClient.getAdvertisingIdInfo.implementation = function (context: any) {
            var spoofedGUID = generateRandomGUID();
            console.log("Spoofed Google Advertising ID:", spoofedGUID);
            var infoObj = Info.$new(spoofedGUID, false);
            return infoObj;
        };
    } catch (e) {
        console.error("Advertising ID Client not found:", e);
    }
    try {
        var SharedPreferencesImpl = Java.use("android.app.SharedPreferencesImpl");
        SharedPreferencesImpl.getString.overload('java.lang.String', 'java.lang.String').implementation = function (key: string, defValue: any) {
            var original = this.getString(key, defValue);
            var guidKeys = ['guid', 'uuid', 'device_id', 'installation_id', 'client_id', 'session_id', 'user_id'];
            var keyLower = key.toLowerCase();
            for (var i = 0; i < guidKeys.length; i++) {
                if (keyLower.includes(guidKeys[i])) {
                    var spoofed = generateRandomGUID();
                    console.log("Spoofed SharedPreferences GUID for key", key + ":", spoofed);
                    return spoofed;
                }
            }
            return original;
        };
    } catch (e) {
        console.error("SharedPreferences hook error:", e);
    }
    try {
        var SystemProperties = Java.use("android.os.SystemProperties");
        SystemProperties.get.overload('java.lang.String').implementation = function (key: string) {
            var original = this.get(key);
            if (key.includes("guid") || key.includes("uuid") || key.includes("serialno")) {
                var spoofed = generateRandomGUID();
                console.log("Spoofed SystemProperty GUID for", key + ":", spoofed);
                return spoofed;
            }
            return original;
        };
        SystemProperties.get.overload('java.lang.String', 'java.lang.String').implementation = function (key: string, def: any) {
            var original = this.get(key, def);
            if (key.includes("guid") || key.includes("uuid") || key.includes("serialno")) {
                var spoofed = generateRandomGUID();
                console.log("Spoofed SystemProperty GUID for", key + ":", spoofed);
                return spoofed;
            }
            return original;
        };
    } catch (e) {
        console.error("SystemProperties hook error:", e);
    }
    try {
        var Secure = Java.use("android.provider.Settings$Secure");
        Secure.getStringForUser.overload('android.content.ContentResolver', 'java.lang.String', 'int').implementation = function (resolver: any, name: string, user: any) {
            if (name === "advertising_id" || name.toLowerCase().includes("ssaid")) {
                var spoofed = generateRandomGUID();
                console.log("Spoofed SSAID/Advertising ID:", spoofed);
                return spoofed;
            }
            return this.getStringForUser(resolver, name, user);
        };
    } catch (e) {
        console.log("SSAID hook error:", e);
    }
    try {
        var InstanceID = Java.use("com.google.android.gms.iid.InstanceID");
        InstanceID.getId.implementation = function () {
            var spoofed = generateRandomGUID();
            console.log("Spoofed GMS Instance ID:", spoofed);
            return spoofed;
        };
        InstanceID.getToken.overload('java.lang.String', 'java.lang.String').implementation = function (authorizedEntity: any, scope: any) {
            var spoofed = generateRandomFID();
            console.log("Spoofed GMS Instance Token:", spoofed);
            return spoofed;
        };
    } catch (e) {
        console.error("GMS Instance ID not found:", e);
    }
    /*
        URI hooks to block gms 
    */
    try {
        const UriClass = Java.use("android.net.Uri");
        UriClass.parse.overload("java.lang.String").implementation = function (inputUriString: string | string[]) {
            if (inputUriString && inputUriString.includes("com.google.android.gsf.gservice")) {
                console.log("Blocked URI.parse for:", inputUriString);
                return null;
            }
            return this.parse.call(this, inputUriString);
        };
    } catch (e) {
        console.error("URI Hook Error:", e);
    }
    try {
        const ContentResolver = Java.use("android.content.ContentResolver");
        ContentResolver.query.overload(
            'android.net.Uri',
            '[Ljava.lang.String;',
            'android.os.Bundle',
            'android.os.CancellationSignal'
        ).implementation = function (uriObj: { toString: () => any; }, projectionArr: any, queryBundle: any, cancelSignal: any) {
            const uriStr = uriObj ? uriObj.toString() : '';
            if (uriStr.includes('com.google.android.gsf.gservice')) {
                console.log("Blocked ContentResolver.query (Bundle) for URI:", uriStr);
                return null;
            }
            return this.query(uriObj, projectionArr, queryBundle, cancelSignal);
        };
        ContentResolver.query.overload(
            'android.net.Uri',
            '[Ljava.lang.String;',
            'java.lang.String',
            '[Ljava.lang.String;',
            'java.lang.String'
        ).implementation = function (uriObj: { toString: () => any; }, projectionArr: any, selectionStr: any, selectionArgsArr: any, sortOrderStr: any) {
            const uriStr = uriObj ? uriObj.toString() : '';
            if (uriStr.includes('com.google.android.gsf.gservice')) {
                console.log("Blocked ContentResolver.query (classic) for URI:", uriStr);
                return null;
            }
            return this.query(uriObj, projectionArr, selectionStr, selectionArgsArr, sortOrderStr);
        };
        ContentResolver.query.overload(
            'android.net.Uri',
            '[Ljava.lang.String;',
            'java.lang.String',
            '[Ljava.lang.String;',
            'java.lang.String',
            'android.os.CancellationSignal'
        ).implementation = function (uriObj: { toString: () => any; }, projectionArr: any, selectionStr: any, selectionArgsArr: any, sortOrderStr: any, cancelSignal: any) {
            const uriStr = uriObj ? uriObj.toString() : '';
            if (uriStr.includes('com.google.android.gsf.gservice')) {
                console.log("Blocked ContentResolver.query (full) for URI:", uriStr);
                return null;
            }
            return this.query(uriObj, projectionArr, selectionStr, selectionArgsArr, sortOrderStr, cancelSignal);
        };
    } catch (e) {
        console.error("ContentResolver Hook Error:", e);
    }

})