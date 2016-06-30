var response = require('../../response');
var gpio = require('rpi-gpio');
var gpioConfig = require('../../gpio.config.js');

var speedUpdate = {
  setSpeed: setSpeed
};

module.exports = speedUpdate;

/**
* @description
*   set speed for both wheels.
*/
function setSpeed(req, res, next) {
  var value = req.params.value || 0;

  gpio.setup(gpioConfig.engineLeft.enablePin1, gpio.DIR_OUT);
  gpio.setup(gpioConfig.engineLeft.enablePin2, gpio.DIR_OUT);
  gpio.setup(gpioConfig.engineLeft.inputPin1, gpio.DIR_OUT);
  gpio.setup(gpioConfig.engineLeft.inputPin2, gpio.DIR_OUT);

  gpio.write(gpioConfig.engineLeft.enablePin1, true, gpioCallback);
  gpio.write(gpioConfig.engineLeft.enablePin2, false, gpioCallback);
  gpio.write(gpioConfig.engineLeft.inputPin1, true, gpioCallback);
  gpio.write(gpioConfig.engineLeft.inputPin2, true, gpioCallback);

  return res.json(response.success(results));

  function gpioCallback(err) {
    if (err) {
      return res.status(400).send(response.error(err));
    }

    console.log('GPIO error: ' + err);
  }
}
