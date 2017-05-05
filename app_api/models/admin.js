var mongoose = require('mongoose');

/* Explain:
role = [
	{value: 1, name: 'Staff'},
	{value: 2, name: 'Content admin'},
	{value: 3, name: 'Manager'},
	{value: 100, name: 'Admin'},
]
permission = [
	{value: 1, name: 'Modify user's profile data'},
	{value: 2, name: 'Modify other user's data'},
	{value: 3, name: 'Modify business data'},
	{value: 4, name: 'Modify everything on the database'},
]

active = [
	{value: true, name: 'Active'},
	{value: false, name: 'Deactive'},	
] 

gender = [
	{value: 1, name: 'Male'},
	{value: 1, name: 'Female'},
	{value: 1, name: 'Other'},
]

transStatus = [
	{value: 1, name: 'Done'},
	{value: 2, name: 'Pending'},
	{value: 3, name: 'Return'},
	{value: 4, name: 'Cancel'},
]

transType = [
	{value: 1, name: 'in'}, // revenue, ...
	{value: 2, name: 'out'}, // cost	
]

assetStatus = [
	{value: 1, name: 'New'},
	{value: 2, name: 'Used but good'},
	{value: 3, name: 'Used'},
],

bookingStatus = [
	{value: '1', name: 'Accept'},
	{value: '2', name: 'Refuse'},
	{value: '3', name: 'Pending'},
	{value: '4', name: 'Cancel'},
],

promoType = [
	{value: 1, name: 'Apply to specific one'},
	{value: 2, name: 'Apply to all'},
	{value: 3, name: 'Apply to some or groups'},
]

productCat = [
	{value: 1, name: 'Main'}, 
	{value: 2, name: 'Soft drink'},
	{value: 3, name: 'Fast food'},
	{value: 4, name: 'Snack'},
]
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
	transStatus: [{value: Number, name: String}],
	transType: [{value: Number, name: String}],
	assetStatus: [{value: Number, name: String}],
	bookingStatus: [{value: Number, name: String}],
	promoType: [{value: Number, name: String}],
	productCat: [{value: Number, name: String}],
});