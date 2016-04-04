function removeMeeting(req, res, next) {
    /*
	/meetings/remove/:id - remove meeting with a given id (del)
	*/
    var mongoInstance = require('../../mongo-init');
    var collectionName = 'meetings';
    var collection;
    var db = mongoInstance.getDb();
    
    // populate variables with values from parameters
    var meetingId = req.params.id || null;
    
    if (meetingId) {
        collection = db.collection(collectionName);
        collection.deleteOne({_id: ObjectId(meetingId)}, function(err, result) {
            if (err === null) {
                res.send({results: {data: result}});
                next();
            } else {
                res.send({err: {
                    message: 'removeMeeting, error: ' + err
                }});
                next();
            }
        });
    } else {
    	res.send({err: {
            message: 'removeMeeting. Parameters meetingId not available.'
        }});
        next();
    }
}

var meetingsDelete = {
    removeMeeting: removeMeeting
};

module.exports = meetingsDelete;