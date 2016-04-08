var response = require('../../response');
var Switch = require('../../models/switch');
var gpio = require("pi-gpio");
 
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
            gpio.open(7, "output", function(err) {     // Open pin 16 for output 
                gpio.write(7, 1, function() {          // Set pin 16 high (1) 
                    gpio.close(7);                     // Close pin 16 
                });
            });
            //
            return res.json(response.success(results));
        }

        return res.status(404).send(response.error('getSwitchState. Error: ' + err));
    });
}
