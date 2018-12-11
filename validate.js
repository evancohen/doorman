exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();
    const request = require('request');

    let restdbURL = context.RESTDB_URL;
    let restdbKey = context.RESTDB_KEY;
    let pin = parseInt(event.pin) || 0;

    console.log("Request URL:", `${restdbURL}?q={"pin":${parseInt(pin)}}`);

    let options = {
        method: 'GET',
        url: `${restdbURL}?q={"pin":${parseInt(pin)}}`,
        headers: {
            'cache-control': 'no-cache',
            'x-apikey': restdbKey,
            'content-type': 'application/json'
        }
    };
    request(options, function (error, response, body) {
            if (error) throw new Error(error);

            /**
             * There are 3 main cases to handle
             * 1) Invalid Pin (Missing)
             * 2) Valid Pin
             * 3) Expired Pin
             */

            jsonbody = JSON.parse(`{"data":${body}}`);
            if (!Array.isArray(jsonbody.data) || !jsonbody.data.length) {
                // #1 This PIN does not exist
                console.log("Invalid PIN");
                twiml.say("Sorry, that is an invalid PIN.");
                twiml.redirect('/pin');
            } else {
                let key = jsonbody.data[0];
                if(Date.now() <= Date.parse(key.expiry)){
                    // #2 Pin is valid
                    console.log("Valid PIN");
                    twiml.redirect('/welcome?callerName='+key.name);
                } else {
                    // #3 Pin is Expired
                    console.log("Expired PIN");
                    twiml.say("Sorry, that PIN has expired. Calling Kartik.");
                    twiml.redirect('/call');
                }
                
            }
        callback(null, twiml);
    });
}; 