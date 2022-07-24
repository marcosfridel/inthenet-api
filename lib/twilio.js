//npm install twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const json = require('./json')

const sendWsp = async (to, body) => {
    const client = require('twilio')(accountSid, authToken);

    await client.messages
      .create({
            from: 'whatsapp:+14155238886',
            body: `${body}`,
            //to: 'whatsapp:+5491157531979'
            to: `whatsapp:+${to}`
        })
        .then(message => {
            console.log('then sendWsp');
            return json.getResult(
                'success',
                message,
                200
            );
        })
        .catch(message => {
            console.log('catch sendWsp');
            return json.getResult(
                'error',
                message,
                503
            );
        });
    
}
//(620) 490-3597
const sendSms = async (to, body) => {
    const client = require('twilio')(accountSid, authToken);

    let options = {
        to: to,
        body: body
    }
    if (process.env.TWILIO_MESSAGING_SERVICE_SID != undefined)
        options = {...options,  messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID }
    else
        options = {...options,  from: process.env.TWILIO_NUMBER_FROM }
    
    console.log('options', options)
    await client.messages
        .create(options)
        .then(message => {
            console.log('then sendSms');
            return json.getResult(
                'success',
                message,
                200
            );
        })
        .catch(message => {
            console.log('catch sendSms', message);
            return json.getResult(
                'error',
                message,
                503
            );
        });
}

module.exports = {
    sendSms,
    sendWsp,
}
