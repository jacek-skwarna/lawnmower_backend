var express = require('express');
var app = require('./server');
var resources = require('./resources');
var jwt = require('jsonwebtoken');
var response = require('./response');

// create instances of the router
var switchesRouter = express.Router();
var accelerationRouter = express.Router();
var gearboxRouter = express.Router();
var steeringWheelRouter = express.Router();

// switches
//switchesRouter.use(tokenMiddleware);
switchesRouter.get('/:_id', resources.switches.read.getSwitchState);

/*
// Categories
categoriesRoutes.get('', resources.categories.read.getCategories);

// Meeting
meetingRoutes.get('', resources.meetings.read.getFullMeeting);
protectedRoutes.post('/meeting', resources.meetings.create.createMeetingInCategory);
protectedRoutes.put('/meeting/:meetingId', resources.meetings.update.update);
protectedRoutes.put('/meeting/:meetingId/join', resources.meetings.update.joinMeeting);
protectedRoutes.put('/meeting/:meetingId/leave', resources.meetings.update.leaveMeeting);

// Meetings
meetingsRoutes.get('', resources.meetings.read.getMeetingsFromCategory);
meetingsRoutes.get('/byids/:meeting_ids', resources.meetings.read.getMeetingsByIds);
meetingsRoutes.delete('/remove/:id', resources.meetings.del.removeMeeting);

// Meetings protected
//protectedRoutes.post('/meetings/create/:category', resources.meetings.create.createMeetingInCategory);
*/

// configure express to use apiRoutes
app.use('/switches', switchesRouter);

//////////////

/**
* @description
*   Function returns false if token is not provided in request header or it can not
*   be decoded properly. If token is valid function add "decoded" property to req object.
*/
function tokenMiddleware(req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));

    // check header or url parameters or post parameter for token
    var token = req.headers['x-access-token'] || false;

    if (!token) {
        console.log('Token not provided.');
        return res.status(401).send(response.error('Token not provided.'));
    }

    // decode token
    console.log('Token provided, token: ' + token + '.');
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
            return res.status(401).send(response.error('Failed to authenticate token. Error: ' + err));
        } else {
            // if everything is ok, save to request for use in other routes
            req.decoded = decoded;
            next();
        }
    });
    
}
