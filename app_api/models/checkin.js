// Checkin model for staff

var mongoose = require('mongoose');
var moment = require ('moment');

var checkinSchema = new mongoose.Schema({
	checkinTime: {type: Date, default: Date.now},
	checkoutTime: {type: Date},
	user:{
		_id: {type: mongoose.Schema.Types.ObjectId},
		fullname: String,
		email: String,
		phone: String
	},
	location: {
		_id: {type: mongoose.Schema.Types.ObjectId},
		name: String,
	},
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: {type: Date},
		explain: {type: Number},
		by: {type: mongoose.Schema.Types.ObjectId}, // staff id
	}],
});

module.exports = mongoose.model ('Checkins', checkinSchema);