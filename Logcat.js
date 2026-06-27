'use strict';

// === CONFIG ===
var LOG_TRACER_CONFIG = {
    JAVA_LOG: true,
    NATIVE_LOG: true,
    MIN_PRIORITY: 3,           // 2=V, 3=D, 4=I, 5=W, 6=E, 7=A
    TAG_INCLUDE: null,         // regex string, null = all. e.g. 'shopee|device|risk'
    TAG_EXCLUDE: 'Choreographer|OpenGLRenderer|GraphicsStats|ViewRootImpl',
    BODY_MAX: 2048,
    RATE_LIMIT_PER_SEC: 200    // 0 = no limit
};

// === RATE LIMITER ===
var _rlBucket = 0, _rlWindow = 0;
function rateLimitOk() {
    if (!LOG_TRACER_CONFIG.RATE_LIMIT_PER_SEC) return true;
    var now = Math.floor(Date.now() / 1000);
    if (now !== _rlWindow) { _rlWindow = now; _rlBucket = 0; }
    if (_rlBucket >= LOG_TRACER_CONFIG.RATE_LIMIT_PER_SEC) return false;
    _rlBucket++;
    return true;
}

// === TAG FILTER ===
var _tagInc = LOG_TRACER_CONFIG.TAG_INCLUDE ? new RegExp(LOG_TRACER_CONFIG.TAG_INCLUDE, 'i') : null;
var _tagExc = LOG_TRACER_CONFIG.TAG_EXCLUDE ? new RegExp(LOG_TRACER_CONFIG.TAG_EXCLUDE, 'i') : null;
function tagOk(tag) {
    tag = tag || '';
    if (_tagExc && _tagExc.test(tag)) return false;
    if (_tagInc && !_tagInc.test(tag)) return false;
    return true;
}

function trunc(s) {
    if (s == null) return '';
    s = String(s);
    return s.length > LOG_TRACER_CONFIG.BODY_MAX
        ? s.substring(0, LOG_TRACER_CONFIG.BODY_MAX) + '...[+' + (s.length - LOG_TRACER_CONFIG.BODY_MAX) + 'B]'
        : s;
}

function emit(level, tag, msg, extra) {
    if (!rateLimitOk()) return;
    if (!tagOk(tag)) return;
    var line = '[' + level + '][' + (tag || '?') + '] ' + trunc(msg);
    if (extra) line += ' | ' + trunc(extra);
    console.log(line);
}

// === JAVA LOG HOOK ===
function installJavaLogHook() {
    try {
        var Log = Java.use('android.util.Log');

        function hook(name, levelChar, sig) {
            try {
                var orig = Log[name].overload.apply(Log[name], sig);
                orig.implementation = function () {
                    var args = arguments;
                    try {
                        var tag = args[0] ? args[0].toString() : null;
                        var msg = args.length >= 2 && args[1] != null ? args[1].toString() : '';
                        var thr = '';
                        if (sig[sig.length - 1] === 'java.lang.Throwable' && args[args.length - 1]) {
                            try { thr = args[args.length - 1].toString(); } catch (e) {}
                        }
                        emit(levelChar, tag, msg, thr);
                    } catch (e) {}
                    return orig.apply(this, args);   // ← CALL SAVED ORIGINAL, NOT this.x()
                };
            } catch (e) {
                console.warn('[log-tracer] skip Log.' + name + '(' + sig.join(',') + '): ' + e.message);
            }
        }

        hook('v', 'V', ['java.lang.String', 'java.lang.String']);
        hook('v', 'V', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('d', 'D', ['java.lang.String', 'java.lang.String']);
        hook('d', 'D', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('i', 'I', ['java.lang.String', 'java.lang.String']);
        hook('i', 'I', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('w', 'W', ['java.lang.String', 'java.lang.String']);
        hook('w', 'W', ['java.lang.String', 'java.lang.Throwable']);
        hook('w', 'W', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('e', 'E', ['java.lang.String', 'java.lang.String']);
        hook('e', 'E', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('wtf', 'A', ['java.lang.String', 'java.lang.String']);
        hook('wtf', 'A', ['java.lang.String', 'java.lang.Throwable']);
        hook('wtf', 'A', ['java.lang.String', 'java.lang.String', 'java.lang.Throwable']);
        hook('println', 'P', ['int', 'java.lang.String', 'java.lang.String']);

        console.log('[log-tracer] Java Log hooks installed');
    } catch (e) {
        console.error('[log-tracer] Java hook failed: ' + e.message);
    }
}

// === NATIVE LOG HOOK ===
function safeReadCString(p) {
    try { return (p && !p.isNull()) ? p.readCString() : null; }
    catch (e) { return null; }
}

function findLogExport(name) {
    try {
        if (typeof Module.findGlobalExportByName === 'function') {
            var p = Module.findGlobalExportByName(name);
            if (p && !p.isNull()) return p;
        }
    } catch (e) {}
    try {
        var m = Process.getModuleByName('liblog.so');
        if (m && m.findExportByName) {
            var p2 = m.findExportByName(name);
            if (p2 && !p2.isNull()) return p2;
        }
    } catch (e) {}
    try { return Module.findExportByName('liblog.so', name); }   // legacy fallback
    catch (e) {}
    return null;
}

var PRIO_NAMES = { 2: 'V', 3: 'D', 4: 'I', 5: 'W', 6: 'E', 7: 'A' };

function installNativeLogHook() {
    var hooks = [
        // int __android_log_print(int prio, const char* tag, const char* fmt, ...);
        // NB: fmt with %s/%d won't be resolved (varargs); shown as raw format.
        { name: '__android_log_print', cb: function (args) {
            var prio = args[0].toInt32();
            if (prio < LOG_TRACER_CONFIG.MIN_PRIORITY) return;
            emit('N' + (PRIO_NAMES[prio] || '?'), safeReadCString(args[1]),
                 safeReadCString(args[2]) + ' [fmt]');
        }},
        // int __android_log_write(int prio, const char* tag, const char* text);
        { name: '__android_log_write', cb: function (args) {
            var prio = args[0].toInt32();
            if (prio < LOG_TRACER_CONFIG.MIN_PRIORITY) return;
            emit('N' + (PRIO_NAMES[prio] || '?'), safeReadCString(args[1]),
                 safeReadCString(args[2]));
        }},
        // int __android_log_vprint(int prio, const char* tag, const char* fmt, va_list);
        { name: '__android_log_vprint', cb: function (args) {
            var prio = args[0].toInt32();
            if (prio < LOG_TRACER_CONFIG.MIN_PRIORITY) return;
            emit('N' + (PRIO_NAMES[prio] || '?'), safeReadCString(args[1]),
                 safeReadCString(args[2]) + ' [vprint]');
        }},
        // void __android_log_assert(const char* cond, const char* tag, const char* fmt, ...);
        { name: '__android_log_assert', cb: function (args) {
            emit('NA', safeReadCString(args[1]),
                 'cond=' + safeReadCString(args[0]) + ' msg=' + safeReadCString(args[2]));
        }},
        // int __android_log_buf_write(int bufID, int prio, const char* tag, const char* text);
        { name: '__android_log_buf_write', cb: function (args) {
            var prio = args[1].toInt32();
            if (prio < LOG_TRACER_CONFIG.MIN_PRIORITY) return;
            emit('N' + (PRIO_NAMES[prio] || '?'), safeReadCString(args[2]),
                 safeReadCString(args[3]));
        }}
    ];

    var installed = 0;
    hooks.forEach(function (h) {
        var addr = findLogExport(h.name);
        if (!addr) return;
        try {
            Interceptor.attach(addr, { onEnter: function (args) { try { h.cb(args); } catch (e) {} } });
            installed++;
        } catch (e) {
            console.warn('[log-tracer] attach ' + h.name + ' fail: ' + e.message);
        }
    });
    console.log('[log-tracer] Native hooks installed: ' + installed);
}

// === ENTRY ===
if (LOG_TRACER_CONFIG.JAVA_LOG) Java.performNow(installJavaLogHook);
if (LOG_TRACER_CONFIG.NATIVE_LOG) installNativeLogHook();
