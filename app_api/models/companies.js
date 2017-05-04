var mongoose = require('mongoose');

var addrSchema = new mongoose.Schema({
	country: {type: Number, 'default': 1, required: true},
	state: {type: Number, required: true}, // or city
	addr1: {type: String, required: true}, // line 1: district, ...
	addr2: {type: String}, // line 2: apt or section
	zipCode: Number,
});

var companiesSchema = mongoose.Schema({
	name: {type:String, required: true},
	representative: {type: String, required: true}, // CEO or others ...
	founded: Date,
	parentComp: mongoose.Schema.Types.ObjectId,
	childComps: [mongoose.Schema.Types.ObjectId],
	deptList: [mongoose.Schema.Types.ObjectId],
	phone: [{type:String}], // phone
	email: [{type:String}],
	address: [addrSchema],
	createdAt: {type: Date, default: Date.now},
	updatedAt: {
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	},
	active: {type: Boolean, default: true},
	deactiveAt: {type: Date},

});

mongoose.model ('companies', companiesSchema);