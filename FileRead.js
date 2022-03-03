var FileLocation = '/storage/emulated/0/x.js';
Java.perform(function() {
    const File = Java.use('java.io.File');
    const FileInputStream = Java.use('java.io.FileInputStream');
    const BufferedInputStream = Java.use('java.io.BufferedInputStream');
    var sourceFile = File.$new.overload('java.lang.String').call(File, FileLocation);
    if (sourceFile.exists() && sourceFile.canRead()) {
        var fis = FileInputStream.$new.overload('java.io.File').call(FileInputStream, sourceFile);
        var bufferedInputStream = BufferedInputStream.$new.overload('java.io.InputStream').call(BufferedInputStream, fis);
        var Data = readNewStream(bufferedInputStream);
        
        // Process read data here
        console.log(Data);
        
        bufferedInputStream.close();
        fis.close();
    } else {
        console.log('Error : File cannot read.')
    }

    function readNewStream(inputStream) {
        var BufferedReader = Java.use('java.io.BufferedReader');
        var InputStreamReader = Java.use('java.io.InputStreamReader');
        var inputStreamReader = InputStreamReader.$new(inputStream);
        var r = BufferedReader.$new(inputStreamReader);
        var StringBuilder = Java.use('java.lang.StringBuilder');
        var total = StringBuilder.$new();
        var String = Java.use('java.lang.String');
        while (true) {
            var line = r.readLine();
            if (line == null) {
                break;
            } else {
                total.append(line).append(String.$new('\n'));
            }
        }
      //  console.log(total.toString());
        return total.toString();
    }
})