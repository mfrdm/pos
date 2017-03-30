var mongoose = require('mongoose');

var ordersSchema = mongoose.Schema({
	name:{type:String}
});

mongoose.model ('orders', ordersSchema);