var response = require('../../response');
var Meeting = require('../../models/meeting');
var User = require('../../models/user');

function createMeetingInCategory(req, res) {
    console.log('createMeetingInCategory, req.decoded: ' + JSON.stringify(req.decoded));
    /*
    /protected/meeting/create - create meeting in given category (post)
    for authorized users only
    */
    console.log('req.body: ' + JSON.stringify(req.body));
    // populate variables with values from parameters
    var category = req.body.category || null;
    var userId = req.decoded._id || null;
    var created = Date.now();
    var meeting_date = req.body.meeting_date || null;
    var members_required = req.body.members_required || null;
    var gender = req.body.gender || null;
    var venue = req.body.venue || null;
    var venue_coordinates = req.body.venue_coordinates || null;
    var level = req.body.level || null;

    if (category && userId && created && meeting_date && members_required && gender && venue && venue_coordinates && level) {
        var newMeeting = new Meeting({
            category: category,
            owner_id: userId,
            created: created,
            meeting_date: meeting_date,
            members_required: members_required,
            gender: gender,
            venue: venue,
            venue_coordinates: venue_coordinates,
            level: level,
            assigned_users_ids: []
        });

        newMeeting.save(function (err, data) {
            if (err) {
                res.json(response.error('createMeetingInCategory. Error: ' + err));
            } else {
                userAddOrganizedMeeting(userId, data._id, function() {
                  return res.json(response.success({ createMeetingInCategory: 'success', data: data }));
                });
            }
        });
    } else {
        res.json(response.error('createMeetingInCategory. Parameters not available.'));
    }

  /**
  * @description
  *   userAddAssignedMeeting function is responsible for adding an _id of a meeting (that user has joined to) to
  *   the assigned_meetings array in user document
  * @param meetingId
  *   it's an _id of a meeting that user has joined
  * @param userId
  *   it's an _id of a user that has joined the meeting
  */
  function userAddOrganizedMeeting(userId, meetingId, callback) {
    User.update(
      {
        _id: userId
      },
      {
        $addToSet: {
          organized_meetings: meetingId
        }
      },
      function(err, results) {
        if (err) {
            return res.json(response.error('userAddOrganizedMeeting. Error: ' + err));
        }
        if (!results) {
            return res.json(response.error('userAddOrganizedMeeting. Error: ' + 'Cannot update organized meetings list.'));
        }
        if (!results.nModified) {
          return callback();
        }

        callback();
      }
    );
  }
}

var meetingsCreate = {
    createMeetingInCategory: createMeetingInCategory
};

module.exports = meetingsCreate;
