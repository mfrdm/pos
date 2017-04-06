var mongoose = require('mongoose');

var productsSchema = mongoose.Schema({
	name: {type:String},
	price: {type:Number},
	category: Number,
	createdAt: {type: Date, default: Date.now},
	updateAt: {
		time: Date,
		explain: String, 
		by: mongoose.Schema.Types.ObjectId,
	},
	compId: mongoose.Schema.Types.ObjectId
});

mongoose.model ('products', productsSchema);