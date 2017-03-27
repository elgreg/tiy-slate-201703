/*
    var ajax = new Ajax( ... );
    ajax
        .then(fn)   // All 200s
        .catch(fn)  // 404, no internet connection
        
*/


class Ajax {
    constructor(url, token = null) {
        this._url = url;
        this._thenChain = [];
        this._catchChain = [];
        this._accessToken = token;
    }

    then(fn) {
        this._thenChain.push(fn);
        return this;
    }

    catch(fn) {
        this._catchChain.push(fn);
        return this;
    }

    get() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', this._url, true);
        
        if(this._accessToken){
            xhr.setRequestHeader("Authorization", "token " + this._accessToken);
        }

        xhr.addEventListener('readystatechange', () => {
            if(xhr.readyState === XMLHttpRequest.DONE){
                if(xhr.status >= 200 && xhr.status < 300){
                    // Avsume JSON
                    let data;
                    if(xhr.responseType === ""){
                        data = JSON.parse(xhr.responseText);
                    } else {
                        data = xhr.response
                    }
                    this._thenChain.forEach(function(callback){
                        data = callback(data);
                    });
                } else if(xhr.status >= 400) {
                    var err = {
                        code: xhr.status,
                        body: xhr.responseText,
                        message: xhr.statusText

                    }
                    
                    this._catchChain.forEach(function(callback){
                        err = callback(err);
                    });
                }
            }            
        });

        xhr.send();

    }
}
