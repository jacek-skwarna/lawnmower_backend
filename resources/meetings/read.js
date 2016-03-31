var response = require('../../response');
var Meeting = require('../../models/meeting');

function getMeetingsFromCategory(req, res, next) {
    /*
    /meetings - get a list of meetings with given parameters - for pagination purpose (get)
    */

    var expectedParams = [
        'category',
        'gender',
        'level',
        'venue'
    ];
    var expectedParamsLength = expectedParams.length;

    var query = {};

    // fill query object according to request query parameters
    for (var i = 0; i < expectedParamsLength; i++) {
      var venueRegex = '';
      console.log('expectedParams[i]: ' + expectedParams[i]);
      if (req.query[expectedParams[i]]) {
        if (expectedParams[i] === 'venue') {
          // special rule for venue - no need for perfect match
          venueRegex = new RegExp(req.query[expectedParams[i]]);
          query[expectedParams[i]] = {
            $regex: venueRegex,
            $options: 'i'
          };
          console.log('w if');
          continue;
        }
        query[expectedParams[i]] = req.query[expectedParams[i]];
      }
    }

    console.log('expectedParamsLength: ' + expectedParamsLength);
    console.log('query: ' + JSON.stringify(query) + ', Object.keys(query).length: ' + Object.keys(query).length);

    // populate variables with values from parameters
    var category = req.query.category || null;
    var offset = parseInt(req.query.offset, 10) || 0;
    var limit = parseInt(req.query.limit, 10) || null;
    var level = parseInt(req.query.level, 10) || null;
    var count_all = 0;

    if (Object.keys(query).length) {
        Meeting.count(query, function(err, result) {
            if (err === null) {
                count_all = result;

                Meeting.find(query, '_id meeting_date assigned_users_ids gender level members_required venue', { skip: offset, limit: limit }, function(err, results) {
                    if (err === null) {
                        res.json(response.successExtended(results, {count_all: count_all}));
                    } else {
                        res.json(response.error(err));
                    }
                });
            } else {
                res.json(response.error('listMeetingsFromCategory. Error: ' + err));
            }
        });
    } else {
        res.json(response.error('listMeetingsFromCategory. Parameters not available.'));
    }
}

function getFullMeeting(req, res, next) {
    /*
    /meetings/meeting/:id - get all informations about meeting with given _id (get)
    */

    // populate variables with values from parameters
    var meetingId = req.query._id || null;

    console.log('req.query: ' + JSON.stringify(req.query));
    console.log('meetingId: ' + meetingId);

    if (meetingId) {
        Meeting.find({_id: meetingId}, function(err, results) {
            if (err === null) {
                res.json(response.success(results));
            } else {
                res.json(response.error(err));
            }
        });
    } else {
        res.json(response.error('getFullMeeting. Parameters not available.'));
    }
}

function getMeetingsByIds(req, res, next) {
    /*
    /meetings/byids/:meeting_ids - get a list of meetings with given ids (get)
    */
    var mongoInstance = require('../../mongo-init');
    var collectionName = 'meetings';
    var collection;
    var db = mongoInstance.getDb();

    // populate variables with values from parameters
    var ids = req.params.meeting_ids || null;

    if (ids && (typeof ids.length) === 'function' && ids.length > 0) {
        collection = db.collection(collectionName);

        collection.find({_id: {$in: ids}}).toArray(function(err, docs) {
            if (err === null) {
                console.log("Found the following records");
                console.dir(docs);
                res.send({results: {data: docs}});
            } else {
                res.send({err: {
                    message: 'getMeetingsByIds. Error: ' + err
                }});
            }

            next();
        });
    } else {
        res.send({err: {
            message: 'getMeetingsByIds. Parameters not available.'
        }});
        next();
    }
}


var meetingsRead = {
    getMeetingsFromCategory: getMeetingsFromCategory,
    getFullMeeting: getFullMeeting,
    getMeetingsByIds: getMeetingsByIds
};

module.exports = meetingsRead;

/*
/meetings/:category/:offset/:limit - pobierz spotkania z danej kategorii uwzględniając offset i limit - potrzebne do stronicowania (get)
*/
