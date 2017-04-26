var mongoose = require('mongoose');

/* Explain:
- Roles:
	+ 1: staff; permission: 1;
	+ 2: content admin (some permissions); permission: 2;
	+ 3: manager (some permission); permission: 3;
	+ 100: admin (All permissions); permission: 100;
- Permission:
	+ 1: modify user's profile data
	+ 2: modify other user's data
	+ 3: modify business data 
	+ 100: modify everything on the database
- Active (for user or customer) 
	+ true: is using the system
	+ false: deactive. no longer use the system
*/

var adminSchema = new mongoose.Schema({
	permission: [{
		name: String, 
		code: Number,
		explain: String,
	}],
	role: {
		name: String,
		code: Number,
		explain: String,
		permission: [Number],
	},
	active: [{value: Boolean, name: String}], 
	gender: [{value: Number, name: String}],
	transCat: [value: Number, name: String],
	assetCat: [value: Number, name: String],
});