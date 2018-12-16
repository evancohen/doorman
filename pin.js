exports.handler = function (context, event, callback) {
    let request = require("request");

    let twiml = new Twilio.twiml.VoiceResponse();
    let restdbURL = context.RESTDB_URL;
    let restdbKey = context.RESTDB_KEY;
    let tries = parseInt(event.tries) || 0;
    console.log("Tries", tries)

    /**
     * [Helper]
     * Prompt the user for a pin
     */
    function gatherPin() {
        if (tries > 2) {
            twiml.say("Too many tries, calling Kartik");
            twiml.redirect('/call');
        }

        let gatherConfigs = {
            input: "speech",
            timeout: 3
        };
        twiml.gather(gatherConfigs)
            .say('Please say your PIN. Or say "help" to call Kartik.');

        // If the user doesn't enter input, loop
        twiml.redirect(`/pin?tries=${tries}`);
    }

    /**
     * [Helper]
     * Validate the speech
     */

    function validatePin(speech) {
        // Make sure we dont get any leftover speech
        let pinIndex = speech.search(/\d{4}/i);
        // If there's a 4 digit pin in the utterance
        if(pinIndex >= 0) {
            let pin = speech.substring(pinIndex, pinIndex + 4);
            twiml.redirect(`/validate?pin=${pin}&tries=${tries}`)
        } else {
            twiml.say("Sorry, I didn't catch that.");
            twiml.redirect(`/pin?tries=${tries + 1}`);
        }
    }

    console.log("Event:", event);
    console.log("Speech Result", event.SpeechResult)
    if (event.SpeechResult) {
        // Call Kartik if the user said help
        if (event.SpeechResult.toLowerCase().includes("help")) {
            twiml.redirect('/call');
        }
        // If input was detected, look up entered PIN
        validatePin(event.SpeechResult);


    } else {
        // If no input was sent, use the <Gather> verb to collect user input
        gatherPin();
    }

    callback(null, twiml);
};