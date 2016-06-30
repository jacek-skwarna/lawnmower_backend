var response = require('../../response');
var gpio = require('rpi-gpio');
var gpioConfig = require('../../gpio.config.js');

var gpioUpdate = {
  setGpio: setGpio
};

module.exports = gpioUpdate;

/**
* @description
*   set speed for both wheels.
*/
function setGpio(req, res, next) {
  var id = req.params.id || null;
  var value = req.params.value || null;

  if (!id) {
    return res.status(404).send(response.error('setGpio. Pin ID not provided.'));
  }

  if (!value && value !== false) {
    return res.status(404).send(response.error('setGpio. Value for Pin ' + id + ' not provided.'));
  }

  gpio.setup(id, gpio.DIR_OUT);
  gpio.write(id, value, gpioCallback);

  return res.json(response.success(results));

  function gpioCallback(err) {
    if (err) {
      return res.status(400).send(response.error(err));
    }

    console.log('GPIO error: ' + err);
  }
}
