var response = require('../../response');
var Switch = require('../../models/switch');

var switchesUpdate = {
  switchState: switchState
};

module.exports = switchesUpdate;

/**
* @description
*   Change state in switch with given _id to opposite value.
*/
function switchState(req, res, next) {
  /*
  /switches/:_id
  */

  var _id = req.params._id || null;

  if (!_id) {
    return res.status(404).send(response.error('switchState. Switch ID not provided.'));
  }

  Switch.findOne({ _id: _id }, toggleSwitch);

  function toggleSwitch(err, switchObject) {
    if (err || !switchObject) {
      return res.status(404).send(response.error('switchState | toggleSwitch. Error: ' + err));
    }

    Switch.update({ _id: _id }, { $set: { state: !switchObject.state } },
      function(err, results) {
      if (err || !results || !results.nModified) {
        return res.status(400).send(response.error('switchState | toggleSwitch | update. Error: ' + err));
      }
      
      return res.json(response.success(results));
    });
  }
}
