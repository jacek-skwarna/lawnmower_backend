var bcrypt = require('bcrypt');
var config = require('../config.js');
var SALT_WORK_FACTOR = config.salt;
var MAX_LOGIN_ATTEMPTS = config.MAX_LOGIN_ATTEMPTS;
var LOCK_TIME = config.LOCK_TIME;

// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	created: { type: Date, default: Date.now(), required: true },
	gender: { type: String, required: true },
	phone: { type: String, required: true },
	nick: { type: String, required: true },
	organized_meetings : [ { type: Schema.Types.ObjectId, required: false } ],
	assigned_meetings : [ { type: Schema.Types.ObjectId, required: false } ],
	// properties for implementing 'Account Lock' functionality
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }
}, {collection: 'users'});

UserSchema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) {
		return next();
	}

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) {
			return next();
		}

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) {
				return next(err);
			}

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {
			return cb(err);
		}

		cb(null, isMatch);
	});
};

UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference 
var reasons = UserSchema.statics.failedLogin = {
    NOT_FOUND: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPTS: 2
};

UserSchema.statics.getAuthenticated = function(email, password, cb) {
    console.log('getAuthenticated');
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        // make sure the user exists
        if (!user) {
            return cb(null, null, reasons.NOT_FOUND);
        }

        // check if the account is currently locked
        if (user.isLocked) {
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.MAX_ATTEMPTS);
            });
        }

        // test for a matching password
        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            // check if the password was a match
            if (isMatch) {
                // if there's no lock or failed attempts, just return the user
                if (!user.loginAttempts && !user.lockUntil) {
                	return cb(null, {_id: user._id});
                }
                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, {_id: user._id});
                });
            }

            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function(err) {
                if (err) return cb(err);
                return cb(null, null, reasons.PASSWORD_INCORRECT);
            });
        });
    });
};

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', UserSchema);