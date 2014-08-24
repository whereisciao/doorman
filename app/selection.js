var twilio = require('twilio'),
    util = require('./util');

module.exports = function (req, res) {
  var twiml = new twilio.TwimlResponse(),
      selectedDigits = req.body.Digits,
      redirected = false,
      config = req.config;

  if (twilio.validateExpressRequest(req, config.twilioAuthToken)) {

    // User wants to enter a security code. Play security prompt and gather
    // security code.
    if (selectedDigits == "*") {
      console.log ("[Talking] Announce Security Prompt");
      twiml = util.securityPrompt(twiml, config.securityPrompt);
    }

    // Security code has been entered, play the tone to open the door.
    else if (selectedDigits == config.securityCode) {
      console.log ("[Action] Security Code Correct. Letting them in.");

      var url = req.protocol + "://" + req.get('host') +
        '/tones/' + config.openKey + '.wav';
      twiml = util.playTone(twiml, url);
    }

    // User has selected an option from the directory. Place the appropraite
    // calls.
    else if (config.choices[selectedDigits]) {
      console.log ("[Action] Calling a roommate.");

      var choice = config.choices[selectedDigits];
      twiml = util.placeCalls(twiml, choice.phones);
    }

    // No valid choice was made.
    else {
      redirected = true;
      res.redirect('/call')
    }

    if (redirected == false){
      res.type('text/xml');
      res.send(twiml.toString());
    }

  } else {
    res.send();
  }
};
