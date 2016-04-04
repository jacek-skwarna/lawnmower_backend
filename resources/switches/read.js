var response = require('../../response');
var Switch = require('../../models/switch');

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
        return res.json(response.error('getSwitchState. Switch ID not provided.'));
    }

    Switch.find({_id: _id}, function(err, results) {
        if (err === null) {
            return res.json(response.success(results));
        }

        return res.json(response.error(err));
    });
}
