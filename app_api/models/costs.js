var mongoose = require('mongoose');

var costsSchema = mongoose.Schema({
	amount: Number,
	costType: Number,
	updateAt: [{
		time: {type: Date},
		explain: String,
		by: mongoose.Schema.Types.ObjectId,
	}],
	createdBy: mongoose.Schema.Types.ObjectId,
	createdAt: {type: Date, default: Date.now},
});

mongoose.model ('costs', costsSchema);