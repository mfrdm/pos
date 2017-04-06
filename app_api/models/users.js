var mongoose = require('mongoose');

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
	birthday: Date,
	gender: Number,
	phone: [{type: String}],
	tempAddress: addrSchema,
	perAddress: addrSchema,
	email: String,
	secondEmail: [{type: String}],
	attendance: [{day: Date, status: Number, explain: String}],
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	active: {type: Boolean, default: true},
	deactiveAt: {type: Date},
	role: {type: Number, required: true}, //(staff, admin, manager)
	permissions: [{type: Number, required: true}], // indicate which resource to be about to access
	edu: [eduSchema],
	workexp: [workexpSchema], // past working experience 
	deptList: [{deptId: mongoose.Schema.Types.ObjectId, deptName: String, status: Number, in: Date, out: Date}],
	compList: [{compId: mongoose.Schema.Types.ObjectId, compName: String, status: Number, in: Date, out: Date}],
	google: { // not complete
		token: String,
		email: String
	},
	role: {type:String},
	permission: {type:Number},
});

// TESTING
usersSchema.methods.confirm = function (){
	var message = this. firstname + ' ' + this.lastname + ' create an account';
	console.log (messgage);
}

mongoose.model ('users', usersSchema);