var mongoose = require('mongoose');

var deptsSchema = mongoose.Schema({
	name:{type:String},
	manager:{type:String},
	staffList:[
		{staffId:{type:mongoose.Schema.Types.ObjectId}}
	]
});

mongoose.model ('depts', deptsSchema);