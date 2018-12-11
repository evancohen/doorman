/**
 * https://doorman-1f48.restdb.io/rest/keys
 * 5c0f48fb5c41c52f7e131f3a
 */

const API_KEY = localStorage.getItem("API_KEY");
const URL = localStorage.getItem("URL")

if (!API_KEY || !URL) {
    $p = $("<p>").attr("class", "alert alert-danger col-12")
    $p.attr("role", "alert")
    $p.text("Please configure settings!")
    $("#generated-code").html($p)
}

const HEADERS = {
    "content-type": "application/json",
    "x-apikey": API_KEY,
    "cache-control": "no-cache"
}

let randomPin = function () {
    return Math.floor(Math.random() * 9000) + 1000;
}

let DB = {
    getCodes: function () {
        return $.ajax({
            "async": true,
            "crossDomain": true,
            "url": URL,
            "method": "GET",
            "headers": HEADERS
        })
    },
    getCode: function (pin) {
        return $.ajax({
            "async": false,
            "crossDomain": true,
            "url": URL + '?q={"pin":' + parseInt(pin) + "}",
            "method": "GET",
            "headers": HEADERS
        })
    },
    codeExists: function (pin) {
        let exists = "ahhh";
        DB.getCode(pin).done(function (result) {
            exists = !!+result.length
        })
        return exists
    },
    addCode: function (name, expiry, pin) {
        return $.ajax({
            "async": true,
            "crossDomain": true,
            "url": URL,
            "method": "POST",
            "headers": HEADERS,
            "data": JSON.stringify({
                "name": name,
                "shared": false,
                "pin": pin,
                "expiry": expiry
            })
        })
    },
    generateCode: function (name, expiry) {
        // Generate a unique random number
        let pin = randomPin()
        console.log(pin)
        while (DB.codeExists(pin)) {
            pin = randomPin()
        }

        // Create a new record
        return DB.addCode(name, expiry, pin)
    },
    deleteCodeByID: function (id) {
        return $.ajax({
            "async": true,
            "crossDomain": true,
            "url": URL + "/" + id,
            "method": "DELETE",
            "headers": HEADERS
        })
    }
}