var mongoose = require('mongoose');

var deptsSchema = mongoose.Schema({
	name:{type:String}
});

mongoose.model ('depts', deptsSchema);