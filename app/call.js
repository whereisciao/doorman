var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    if (config.introduction) {
      console.log ("[Picks up Call] Hello");

      twiml.say(config.introduction);
    }

    if (config.choices) {
      console.log ("[Talking] Announce Choices");

      twiml = util.announceChoices(twiml, config.choices);
    } else if (config.securityCode) {
      console.log ("[Listening] Waiting for Code");

      twiml = util.waitForCode(twiml);
    }

    if (config.phones) {
      twiml = util.placeCalls(twiml, config.phones);
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } else {
    res.send(403);
  }
};
