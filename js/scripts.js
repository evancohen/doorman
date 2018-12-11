const API_KEY = "5c0f48fb5c41c52f7e131f3a";

var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://doorman-1f48.restdb.io/rest/keys",
    "method": "GET",
    "headers": {
        "content-type": "application/json",
        "x-apikey": "API_KEY",
        "cache-control": "no-cache"
    }
}

$.ajax(settings).done(function (response) {
    console.log(response);
});