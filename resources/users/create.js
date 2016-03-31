var server = require('../../server');
var response = require('../../response');
var User = require('../../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

function authenticateUser(req, res) {
    console.log('authenticateUser');
    /*
    /user/authenticate - authenticate user and create token (post)
    you should make sure that the unique index is set on the field 'email' within 'users' collection 
    */

    if (req.body.email && req.body.password) {
        User.getAuthenticated(req.body.email, req.body.password, function(err, user, reason) {
            var token;

            if (err) {
                res.json(response.error(err));
            };

            // login was successful if we have a user
            if (user) {
                // handle login success
                token = jwt.sign(user, server.get('superSecret'), {
                    expiresIn: 86400 //expires in 24 hours
                });

                res.json(response.success({ token: token, user: { _id: user._id, email: user.email, nick: user.nick } }));

                return;
            }

            // otherwise we can determine why we failed
            var reasons = User.failedLogin;
            switch (reason) {
                case reasons.NOT_FOUND:
                    res.json(response.error('Authentication failed. Reason id: ' + reasons.NOT_FOUND + '.'));
                    break;
                case reasons.PASSWORD_INCORRECT:
                    res.json(response.error('Authentication failed. Reason id: ' + reasons.PASSWORD_INCORRECT + '.'));
                    break;
                case reasons.MAX_ATTEMPTS:
                    res.json(response.error({accountLocked: true}));
                    break;
            }

            return;
        });
    } else {
        res.json(response.error('Authentication failed. Provide all required parameters.'));
    }
}

function authenticateByToken(req, res) {
    console.log('authenticateUser');
    /*
    protected/users/authenticatebytoken - authenticate user by token (post)
    you should make sure that the unique index is set on the field 'email' within 'users' collection 
    */

    if (req.decoded) {
        res.json(response.success(req.decoded));
    } else {
        res.json(response.error('Authentication failed. Decoded data not available.'));
    }
}

function getFullUser(req, res, next) {
    /*
    /user?user_id - get all informations about user with given _id (get)
    */
    // populate variables with values from parameters
    var userId = req.query._id || null;
        
    if (userId) {
        User.findOne({_id: userId}, 'email phone nick', function(err, results) {
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

function createUser(req, res) {
    /*
    /user - create user (post)
    you should make sure that the unique index is set on the field 'email' within 'users' collection 
    */
    var newUser;
    
    // populate variables with values from parameters
    var email = req.body.email || null;
    var password = req.body.password || null;
    var phone = req.body.phone || '';
    var nick = req.body.nick || '';
    var gender = req.body.gender || null;

    newUser = new User({
        email: email,
        password: password,
        gender: gender,
        phone: phone,
        nick: nick
    });

    newUser.save(function (err, data) {
        if (err) {
            res.json(response.error(err));
        } else {
            res.json(response.success(data));
        }
    });
}

var usersCreate = {
    authenticateUser: authenticateUser,
    createUser: createUser,
    authenticateByToken: authenticateByToken
};

module.exports = usersCreate;