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
        twiml.redirect('/validate?pin='+pin)
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