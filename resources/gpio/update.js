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
  gpio.setup(7, gpio.DIR_OUT, write);
 
  function write() {
      gpio.write(7, true, function(err) {
          if (err) throw err;
          console.log('Written to pin');
      });
  }

  /*
  var id = req.params.id || null;
  var value = req.body.value;

  console.log('setGpio, req.params: ' + JSON.stringify(req.params));
  console.log('setGpio, typeof value: ' + typeof value);


  if (!id) {
    return res.status(404).send(response.error('setGpio. Pin ID not provided.'));
  }

  if (!value && value !== false) {
    return res.status(404).send(response.error('setGpio. Value for Pin ' + id + ' not provided.'));
  }

  gpio.setup(7, gpio.DIR_OUT, write);

  function write() {
    console.log('id: ' + id + ', value: ' + value);
    //gpio.write(15, true, gpioCallback);

    gpio.write(7, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
  }

  function gpioCallback(err) {
    if (err) {
      console.log('GPIO error: ' + err);
      return res.status(400).send(response.error(err));
    }

    return res.json(response.success({}));
  }
  */
}
