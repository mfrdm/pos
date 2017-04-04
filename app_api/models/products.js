var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
	name:{type:String},
	price:{type:Number}
});

mongoose.model ('products', productsSchema);