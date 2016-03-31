var response = require('../../response');
var User = require('../../models/user');

function getFullUser(req, res, next) {
	/*
	/user?user_id - get all informations about user with given _id (get)
	*/
    // populate variables with values from parameters
    var userId = req.query._id || null;

    if (userId) {
        User.findOne({_id: userId}, 'email phone nick gender organized_meetings assigned_meetings', function(err, results) {
            if (err === null) {
                res.json(response.success(results));
            } else {
                res.json(response.error('getFullUser. Error: ' + err));
            }
        });
    } else {
        res.json(response.error('getFullUser. Parameters not available.'));
    }
}

var usersRead = {
    getFullUser: getFullUser
};

module.exports = usersRead;
