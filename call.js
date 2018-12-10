exports.handler = function (context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse()

    // Call Kartik
    let phoneNumber = context.KARTIK_PHONE_NUMBER;
    let dialParams = { 'callerId': callerId, 'timeLimit': 200 };

    twiml.dial(dialParams, phoneNumber);

    callback(null, twiml)
}