exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse()

    let phoneNumber = context.KARTIK_PHONE_NUMBER;
    let callerId = event.From || 'No Number';
    let dialParams = { 'callerId': callerId, 'timeLimit': 200 };

    twiml.say("Connecting you now.")
    twiml.dial(dialParams, phoneNumber);

    callback(null, twiml)
}