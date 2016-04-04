// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Switch', new Schema({
	_id: { type: String, required: true },
	name: { type: String, required: true },
	state: { type: Boolean, default: false, required: true }
}, {collection: 'lawnmower_switches'}));