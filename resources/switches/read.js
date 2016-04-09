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
        if (err !== null || !results.length) {
            return res.status(404).send(response.error('getSwitchState. Error: ' + err));
        }

        // gpio test
        gpio.setup(7, gpio.DIR_OUT, write);
        
        return res.json(response.success(results));

        function write() {
            gpio.write(7, true, function(err) {
                if (err) {
                    return res.status(400).send(response.error('getSwitchState, write to pin problem. Error: ' + err));
                    throw err;
                }
                console.log('Written to pin');
            });
        }
    });
}
