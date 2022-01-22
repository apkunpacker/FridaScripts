//Broken Script . Please Fix 
var gettid = new NativeFunction(Module.findExportByName("libc.so", "gettid"), 'pointer', ['pointer', 'int', 'pointer']);
var gettid = new NativeFunction(Module.findExportByName("libc.so", "gettid"), 'int', []);
var main_tid = gettid();
var handler = Memory.alloc(8);
Memory.protect(handler, 8, 'rwx');
Interceptor.replace(handler, new NativeCallback(function(sig) {
    console.log('handle -> ' + gettid());
    while (sleep) {
        Thread.sleep(1);
    }
    return sig;
}, 'int', ['int']));

function att(off, pt) {
    if (base === 0) {
        return;
    }
    targets['' + pt] = Interceptor.attach(pt, function() {
        sleep = true;
        var signal = new NativeFunction(Module.findExportByName("libc.so", "signal"), 'int', ['int', 'pointer']);
        var tkill = new NativeFunction(Module.findExportByName("libc.so", "tkill"), 'int', ['int', 'int']);
        signal(12, handler);
        var t_hooks = {};
        var ts = readThreads();
        for (var to in ts) {
            var t = ts[to];
            if (t[0].indexOf('gum') >= 0 || t[0].indexOf('gdbus') >= 0) {
                continue;
            }
            if (t[2] === 'R') {
                if (parseInt(t[0]) !== main_tid) {
                    try {
                        tkill(parseInt(t[0]), 12);
                        console.log('signaling -> ' + t[1]);
                    } catch (e) {}
                }
            } else {
                var tpc = ptr(t[29]);
                if (t_hooks[t[29]] !== null && typeof t_hooks[t[29]] !== 'undefined') {
                    continue;
                }
                console.log('attaching -> ' + tpc);
                t_hooks[t[29]] = Interceptor.attach(tpc, function() {
                    console.log('sleep -> ' + this.context.pc);
                    while (sleep) {
                        Thread.sleep(1);
                    }
                });
            }
        }
        while (sleep) {
            Thread.sleep(1);
        }
        for (var k in t_hooks) {
            t_hooks[k].detach();
        }
    });
}

function readThreads() {
    var m_alloc = Memory.alloc(1024);
    Memory.protect(m_alloc, 1024, 'rwx');
    var opendir = new NativeFunction(Module.findExportByName("libc.so", "opendir"), 'pointer', ['pointer']);
    var readdir = new NativeFunction(Module.findExportByName("libc.so", "readdir"), 'pointer', ['pointer']);
    var fopen = new NativeFunction(Module.findExportByName("libc.so", "fopen"), 'pointer', ['pointer', 'pointer']);
    var fgets = new NativeFunction(Module.findExportByName("libc.so", "fgets"), 'pointer', ['pointer', 'int', 'pointer']);
    Memory.writeUtf8String(m_alloc, '/proc/self/task');
    var proc_dir = opendir(m_alloc);
    var entry;
    var res = [];
    while ((entry = readdir(proc_dir)) > 0) {
        var line = Memory.readUtf8String(entry.add(19));
        if (line.indexOf('.') >= 0) {
            continue;
        }
        Memory.writeUtf8String(m_alloc, '/proc/' + pid + '/task/' + line + '/stat');
        Memory.writeUtf8String(m_alloc.add(64), 'r');
        try {
            var fp = fopen(m_alloc, m_alloc.add(64));
            line = Memory.readUtf8String(fgets(m_alloc, 1024, fp));
            var name = line.substring(line.indexOf('('), 1 + line.indexOf(')'));
            line = line.replace(' ' + name, '');
            var proc = line.split(' ');
            proc.splice(1, 0, name.replace('(', '').replace(')', ''));
            res.push(proc);
        } catch (e) {}
    }
    return res;
}