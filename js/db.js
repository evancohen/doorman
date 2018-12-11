const API_KEY = "5c0f48fb5c41c52f7e131f3a";
const URL = "https://doorman-1f48.restdb.io/rest/keys"
const HEADERS = {
    "content-type": "application/json",
    "x-apikey": API_KEY,
    "cache-control": "no-cache"
}

let DB = {
    getCodes: function() {
        return $.ajax({
            "async": true,
            "crossDomain": true,
            "url": URL,
            "method": "GET",
            "headers": HEADERS
        })
    },
    getCode: function(pin) {
        return $.ajax({
            "async": true,
            "crossDomain": true,
            "url": URL + `?q={"pin":${parseInt(pin)}`,
            "method": "GET",
            "headers": HEADERS
        })
    },
    checkCode: function(pin) {
        
    },
    generateCode: function() {
        let code = Math.floor(Math.random() * 9000) + 1000;
        // Ensure the code is unique
        DB.getCode(pin)
    }
}