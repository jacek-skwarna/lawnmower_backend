// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Meeting', new Schema({
	category: { type: String, required: true },
	owner_id: { type: Schema.Types.ObjectId, required: true },
	created: { type: Date, default: Date.now, required: true },
	meeting_date: { type: Date, required: true },
	members_required: { type: Number, required: true },
	gender: { type: String, required: true },
	venue: { type: String, required: true },
	venue_coordinates: {
		lat: { type: Number, required: true},
      	lng: { type: Number, required: true}
	},
	level: { type: Number, required: true },
	assigned_users_ids: [{ type: Schema.Types.ObjectId, required: false }]
}, {collection: 'meetings'}));