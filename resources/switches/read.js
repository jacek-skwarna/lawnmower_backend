var response = require('../../response');
var Switch = require('../../models/switch');
var gpio = require('rpi-gpio');
 
var switchesRead = {
    getSwitchState: getSwitchState
};

module.exports = switchesRead;

/////////////

function getSwitchState(req, res, next) {
    /*
    /switches/:_id - get all informations about meeting with given _id (get)
    */

    // populate variables with values from parameters
    var _id = req.params._id || null;

    if (!_id) {
        return res.status(404).send(response.error('getSwitchState. Switch ID not provided.'));
    }

    Switch.find({_id: _id}, function(err, results) {
        if (err === null && results.length) {
            // gpio test
            gpio.setup(7, gpio.DIR_OUT, write);

            function write() {
                gpio.write(7, true, function(err) {
                    if (err) throw err;
                    console.log('Written to pin');
                    return res.json(response.success(results));
                });
            }
            //
            //return res.json(response.success(results));
        } else {

            return res.status(404).send(response.error('getSwitchState. Error: ' + err));
        }
    });
}
