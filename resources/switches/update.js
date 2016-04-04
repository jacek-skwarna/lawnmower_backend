var response = require('../../response');
var Meeting = require('../../models/meeting');
var User = require('../../models/user');

function update(req, res, next) {
    /*
    /protected/meeting/:meetingId - allows current user to update his meeting (put)
    */

    var userId = typeof req.decoded._id === 'undefined' ? null : req.decoded._id,
        meetingId = typeof req.params.meetingId === 'undefined' ? null : req.params.meetingId;

    Meeting.update({_id: meetingId, owner_id: { $eq: userId } }, { $set: req.body},
    function(err, results) {
      if (err) {
        return res.json(response.error('Meeting update(). Error: ' + err));
      }
      if (results && results.nModified) {
        return res.json(response.success(results));
      }

      return res.json(response.error('Meeting update(). Error.'));
    });
}

function joinMeeting(req, res, next) {
    /*
    /protected/meeting/:meetingId/join - allows current user to join a meeting (put)
    */

    var userId = typeof req.decoded._id === 'undefined' ? null : req.decoded._id,
        meetingId = typeof req.params.meetingId === 'undefined' ? null : req.params.meetingId;
        gender = null;

    console.log('userId: ' + userId);

    if (!userId || !meetingId) {
        return res.json(response.error('assignUser. Error: User _id or meeting _id not valid.'));
    }

    User.findOne({_id: userId}, 'gender', function(err, results) {
        if (err) {
            return res.json(response.error('assignUser. Error: ' + err));
        }

        if (!results) {
            return res.json(response.error('assignUser. Error: Wrong user _id.'));
        }

        console.log('results: ' + JSON.stringify(results));

        gender = results.gender;
        Meeting.update({
            _id: meetingId,
            owner_id: {
                $ne: userId
            },
            $or: [
                {
                    gender: gender
                },
                {
                    gender: ''
                }
            ],
            $where: function() {
                return this.assigned_users_ids.length < this.members_required;
            }
        },
        {
            $addToSet: {
                assigned_users_ids: userId
            }
        },
        function(err, results) {
            if (err) {
                return res.json(response.error('assignUser. Error: ' + err));
            }
            if (results && results.nModified) {
              userAddAssignedMeeting(userId, meetingId, function() {
                return res.json(response.success(results));
              });
            } else {
              return res.json(response.error('assignUser. Error: ' + 'Already assigned, or meeting is full.'));
            }
        });
    });

    /**
    * @description
    *   userAddAssignedMeeting function is responsible for adding an _id of a meeting (that user has joined to) to
    *   the assigned_meetings array in user document
    * @param meetingId
    *   it's an _id of a meeting that user has joined
    * @param userId
    *   it's an _id of a user that has joined the meeting
    */
    function userAddAssignedMeeting(userId, meetingId, callback) {
      User.update(
        {
          _id: userId
        },
        {
          $addToSet: {
            assigned_meetings: meetingId
          }
        },
        function(err, results) {
          if (err) {
              return res.json(response.error('userAddAssignedMeeting. Error: ' + err));
          }
          if (!results) {
              return res.json(response.error('userAddAssignedMeeting. Error: ' + 'Cannot update assigned meetings list.'));
          }
          if (!results.nModified) {
            return callback();
          }

          callback();
        }
      );
    }
}

function leaveMeeting(req, res, next) {
    /*
    /protected/meeting/:meetingId/leave - allows current user to leave a meeting (put)
    */

    var userId = typeof req.decoded._id === 'undefined' ? null : req.decoded._id,
        meetingId = typeof req.params.meetingId === 'undefined' ? null : req.params.meetingId;

    console.log('userId: ' + userId);

    if (!userId || !meetingId) {
        return res.json(response.error('leaveMeeting. Error: User _id or meeting _id not valid.'));
    }

    Meeting.update({
        _id: meetingId,
    },
    {
        $pull: {
            assigned_users_ids: userId
        }
    },
    function(err, results) {
        if (err) {
            return res.json(response.error('unassignUser. Error: ' + err));
        }
        if (!results || !results.nModified) {
            return res.json(response.error('unassignUser. Error: ' + 'You were not assigned to this meeting.'));
        }

        userRemoveAssignedMeeting(userId, meetingId, function() {
          return res.json(response.success(results));
        });
    });

    /**
    * @description
    *   userRemoveAssignedMeeting function is responsible for adding an _id of a meeting (that user has joined to) to
    *   the assigned_meetings array in user document
    * @param meetingId
    *   it's an _id of a meeting that user has joined
    * @param userId
    *   it's an _id of a user that has joined the meeting
    */
    function userRemoveAssignedMeeting(userId, meetingId, callback) {
      User.update(
        {
          _id: userId
        },
        {
          $pull: {
            assigned_meetings: meetingId
          }
        },
        function(err, results) {
          if (err) {
              return res.json(response.error('userRemoveAssignedMeeting. Error: ' + err));
          }
          if (!results) {
              return res.json(response.error('userRemoveAssignedMeeting. Error: ' + 'Cannot update assigned meetings list.'));
          }
          if (!results.nModified) {
            return callback();
          }

          callback();
        }
      );
    }
}

var meetingsUpdate = {
    update: update,
    joinMeeting: joinMeeting,
    leaveMeeting: leaveMeeting
};

module.exports = meetingsUpdate;
