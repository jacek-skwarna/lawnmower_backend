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

var isTokenValid = isTokenValid;

// route middleware to verify a token
protectedRoutes.use(function(req, res, next) {
    console.log('req.body: ' + JSON.stringify(req.body));

    // check header or url parameters or post parameter for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        console.log('token provided, token: ' + token);
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json(response.error('Failed to authenticate token. Error: ' + err));
            } else {
                // if everything is ok, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        console.log('token not provided');
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// User
userRoutes.get('', resources.users.read.getFullUser);
userRoutes.post('', resources.users.create.createUser);
userRoutes.post('/authenticate', resources.users.create.authenticateUser);
protectedRoutes.get('/user', resources.users.read.getFullUser);
protectedRoutes.post('/user/authenticatebytoken', resources.users.create.authenticateByToken);
protectedRoutes.put('/user/:id/', resources.users.update.update);

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

// configure express to use apiRoutes
app.use('/protected', protectedRoutes);
app.use('/user', userRoutes);
app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);
app.use('/meeting', meetingRoutes);
app.use('/meetings', meetingsRoutes);

//////////////
/**
* @description
*   function returns false if token is not provided in request header or it can not
*   be decoded properly. If token is valid function returns decoded object
* @param req
*   it's a request object
*/
function isTokenValid(req) {
    // check header or url parameters or post parameter for token
    var token = req.headers['x-access-token'] || false;

    if (!token) {
        console.log('token not provided');
        return false;
    }

    // decode token
    console.log('token provided, token: ' + token);

    // verify secret and check exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
        if (err) {
            console.log('Failed to authenticate token. Error: ' + err);
            return false;
        } else {
            return decoded;
        }
    });
    return true;
}
