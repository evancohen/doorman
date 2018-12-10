exports.handler = function (context, event, callback) {
    let request = require("request");
    
    let twiml = new Twilio.twiml.VoiceResponse();
    let restdbURL = context.RESTDB_URL;
    let restdbKey = context.RESTDB_KEY;
    let tries = parseInt(event.tries) || 0;
    

    // Ask user for PIN
    function gatherPin() {
        if(tries > 2){
            twiml.say("Too many trys, calling Kartik");
            twiml.redirect('/call');
        }

        let gatherConfigs = {
            numDigits: 4,
            timeout: 15
        };
        twiml.gather(gatherConfigs)
            .say('Please enter your PIN or 0, 0, 0, 0 to call Kartik');

        // If the user doesn't enter input, loop
        twiml.redirect('/pin');
    }

    function validatePin(pin) {
        var options = {
            method: 'GET',
            url: restdbURL,
            headers: {
                'cache-control': 'no-cache',
                'x-apikey': restdbKey
            },
            from: {
                'pin': parseInt(pin)
            }
        };
        
        console.log("Validating pin...")

        request(options, function (error, response, body) {
            console.log("Request Results",error, body);
            if (error) throw new Error(error);

            /**
             * There are 3 main cases to handle
             * 1) Invalid Pin (Missing)
             * 2) Valid Pin
             * 3) Expired Pin
             */
            if (body.length === 0) {
                // #1 This PIN does not exist
                twiml.say("Sorry, that is an invalid PIN.").pause();
                tries++;
                gatherPin();
            } else {
                let key = body[0];
                if(Date.now() <= Date.parse(key.expriy)){
                    // #2 Pin is valid
                    twiml.redirect('/welcome?callerName=' + key.name);
                } else {
                    // #3 Pin is Expired
                    twiml.say("Sorry, that PIN has expired. Calling Kartik.");
                    twiml.redirect('/call');
                }
                
            }
        });
    }

    console.log("Event:", event);
    if (event.Digits) {
        // Call Kartik if the user entered '0000'
        if(event.Digits == "0000"){
            twiml.redirect('/call');
        }
        // If input was detected, look up entered PIN
        validatePin(event.Digits);


    } else {
        // If no input was sent, use the <Gather> verb to collect user input
        gatherPin();
    }

    // if (tries < 2) {
    //     twiml.redirect(`/trypin?tries=${tries + 1}`);
    // }

    console.log("about to end...")
    callback(null, twiml);
};