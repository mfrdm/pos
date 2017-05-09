var mongoose = require('mongoose');

var deptsSchema = mongoose.Schema({
	name: {type:String},
	manager: {
		type:String
	},
	staffList: [mongoose.Schema.Types.ObjectId],
	compId: mongoose.Schema.Types.ObjectId,
	childDeptList: [mongoose.Schema.Types.ObjectId],
	parentDeptId: mongoose.Schema.Types.ObjectId, // could be null
	contact: {
		phone: {type:String},
		email: {type:String},
	},
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
});

mongoose.model ('depts', deptsSchema);