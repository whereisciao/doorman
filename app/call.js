var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    // Expected Call. Letting them in.
    if (global.doorTimeout > Date.now()) {
      console.log ("Expected Call. Letting guest in");

      var url = req.protocol + "://" + req.get('host') +
        '/tones/' + config.openKey + '.wav';
      console.log(url);
      twiml = util.playTone(twiml, url);
    }

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
