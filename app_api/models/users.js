var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');


var addrSchema = new mongoose.Schema({
	country: {type: Number, 'default': 1, required: true},
	state: {type: Number, required: true}, // or city
	addr1: {type: String, required: true}, // line 1: district, ...
	addr2: {type: String}, // line 2: apt or section
	zipCode: Number,
});

var eduSchema = new mongoose.Schema({
	school: {type: String, required: true},
	title: {type: String, required: true}, // master, graduate, 
	start: {type: Date, required: true},
	end: {type: Date, required: true} 
});	

var workexpSchema = new mongoose.Schema({
	position: {type: Number, required: true},
	desc: String,
	jobRef: mongoose.Schema.Types.ObjectId, // if get job from this website
	compName: {type: String, required: true},
	salary: Number,
	start: {type: Date},
	end: {type: Date},	
});

var usersSchema = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type: String, required: true},
	// birthday: {type: Date, required: true},
	// gender: {type: Number, required: true},
	phone: {type: String, required: true},
	secondPhones: [{type: String}],
	tempAddress: addrSchema,
	perAddress: addrSchema,
	email: {type: String},
	secondEmails: [{type: String}],
	attendance: [{day: Date, status: Number, explain: String}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId // user id of those who made change
	}],
	active: {type: Boolean, default: true},
	deactiveAt: {type: Date},
	// role: {type: Number, required: true}, //(staff, admin, manager)
	// permissions: [{type: Number, required: true}], // indicate which resource to be about to access
	// edu: [eduSchema],
	// workexp: [workexpSchema], // past working experience 
	// deptList: [{deptId: mongoose.Schema.Types.ObjectId, deptName: String, status: Number, in: Date, out: Date}],
	// compList: [{compId: mongoose.Schema.Types.ObjectId, compName: String, status: Number, in: Date, out: Date}],
	// google: { // not complete
	// 	token: String,
	// 	email: String
	// },
	hash: String,
	salt: String,

});


// TESTING static method
// usersSchema.statics.findAdmin = function (){
// 	var adminName = 'Hiep';
// 	return this.find ({'firstname': adminName})
// }

usersSchema.methods.setPassword = function (passwd){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
};

usersSchema.methods.validPassword = function (passwd){
	var hash = crypto.pbkdf2Sync(passwd, this.salt, 1000, 64).toString('hex');
	return this.hash === hash
};

usersSchema.methods.generateJwt = function (passwd, dayNum){
	dayNum = dayNum ? dayNum : 365; // subject to CHANGE
	var expiry = new Date ();
	expiry.setDate (expiry.getDate() + dayNum);

	return jwt.sign ( // include fields to return when user login or register
		{	
			_id: this._id,
			phone: this.phone,
			firstname: this.firstname,
			lastname: this.lastname,
			exp: parseInt(expiry.getTime() / 1000)
		},
		process.env.JWT_SECRET
	);
};


mongoose.model ('users', usersSchema);