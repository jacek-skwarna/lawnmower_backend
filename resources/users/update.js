var response = require('../../response');
var User = require('../../models/user');

function update(req, res, next) {
    /*
    /protected/user/:id - update user data (put)
    */

    var userId = typeof req.decoded._id === 'undefined' ? null : req.decoded._id,
        userIdFromUrl = typeof req.params.id === 'undefined' ? null : req.params.id;

    if (!userId || !userIdFromUrl || userId !== userIdFromUrl) {
      return res.json(response.error('User update error. User ID not defined.'));
    }

    User.update({ _id: userId }, { $set: req.body},
    function(err, results) {
      if (err) {
        return res.json(response.error('User update(). Error: ' + err));
      }
      if (results && results.nModified) {
        return res.json(response.success(results));
      }

      return res.json(response.error('User update(). Error.'));
    });
}

var userUpdate = {
    update: update
};

module.exports = userUpdate;
