Java.perform(function () {
    try {
        let OkHttpClient = Java.use('okhttp3.OkHttpClient');
        OkHttpClient.newCall.overload('okhttp3.Request').implementation = function (request) {
            let logData = {
                url: request.url().toString(),
                method: request.method(),
                headers: {},
                body: null
            };
            let headers = request.headers();
            let headerNames = headers.names().toArray();
            for (let i = 0; i < headerNames.length; i++) {
                logData.headers[headerNames[i]] = headers.get(headerNames[i]);
            }
            if (request.body()) {
                logData.body = request.body().toString();
            }
            console.log('[Request - OkHttpClient]');
            console.log(JSON.stringify(logData, null, 2));
            let response = this.newCall(request).execute();
            let responseData = {
                statusCode: response.code(),
                headers: {},
                body: response.body().string()
            };
            let responseHeaders = response.headers();
            let responseHeaderNames = responseHeaders.names().toArray();
            for (let i = 0; i < responseHeaderNames.length; i++) {
                responseData.headers[responseHeaderNames[i]] = responseHeaders.get(responseHeaderNames[i]);
            }

            console.log('[Response - OkHttpClient]');
            console.log(JSON.stringify(responseData, null, 4));
            return this.newCall(request);
        };
    } catch (error) {
        //console.error('OkHttpClient not found or there was an issue hooking it.');
    }
});
