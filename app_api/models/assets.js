var mongoose = require('mongoose');

var assetsSchema = mongoose.Schema({
	name: String,
	parentCat: Number,
	category: Number,
	quantity: Number,
	createdAt: {type: Date, default: Date.now},
	updatedAt: [{
		time: {type: Date}, 
		explain: String,
		by: mongoose.Schema.Types.ObjectId
	}],
	status: Number, // quality of asset
	storeId: mongoose.Schema.Types.ObjectId,
	compId: mongoose.Schema.Types.ObjectId,
});

mongoose.model ('assets', assetsSchema);