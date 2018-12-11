exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();
    let notifyPhoneNumber = context.KARTIK_PHONE_NUMBER;
    let callerName = decodeURIComponent(event.callerName) || null;
    let notification = 'A guest has arrived';

    if (callerName) {
        notification = callerName + " has arrived";
    }
    twiml.say('Welcome ' + callerName + '. Please proceed to apartment 903.');

    // Should play the 9 key to let people in.
    // Maybe replace with digits and see if that works.
    //twiml.play('/assets/9.mp3');
    twiml.play({digits: '9'})
    // twiml.pause({length:1})
    twiml.play({digits: '6'})
    // twiml.pause({length:1})
    // twiml.play({digits: '9'})

    // Notify the relevant parties
    twiml.sms(notification, {to: notifyPhoneNumber});

    callback(null, twiml);
};