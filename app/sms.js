var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      fromDigits = req.body.From,
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    if (config.users.indexOf(fromDigits) >= 0) {
      console.log ("[Action] Waiting to let guest in.");

      global.doorTimeout = Date.now() + (config.doorTimeout * 60000);
      twiml = util.sendSms(twiml, "Ready");
    } else {
      console.log ("[Action] I have no idea who this is.");

      twiml = util.sendSms(twiml, "Sorry. I don't know who you are.");
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } else {
    res.send(403);
  }
};
