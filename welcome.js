exports.handler = function(context, event, callback) {
    let twiml = new Twilio.twiml.VoiceResponse();
    let notifyPhoneNumber = context.KARTIK_PHONE_NUMBER;
    let callerName = event.callerName || null;
    let notification = 'You have a guest';

    if (callerName) {
        twiml.say(callerName);
        notification = notification + ' named ' + callerName;
    }
    twiml.say('Welcome ' + callerName + '. Please proceed to apartment 903.');

    // Should play the 9 key to let people in.
    // Maybe replace with digits and see if that works.
    twiml.play('/assets/9.mp3');
    twiml.play(null, {digits: 9});

    // Notify the relevant parties
    twiml.sms(notification, {to: notifyPhoneNumber});

    callback(null, twiml);
};