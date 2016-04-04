module.exports = {
	secret: 'hbj32&hghg',
	database: 'mongodb://lawnmower:placEK2&@ds013270.mlab.com:13270/lawnmower',
	salt: 10,
	// max of 5 login attempts, resulting in a 2 hour lock
	MAX_LOGIN_ATTEMPTS: 5,
	LOCK_TIME: 2 * 60 * 60 * 1000
};