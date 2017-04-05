var mongoose = require('mongoose');

var costsSchema = mongoose.Schema({
	amount: Number,
	costType: Number,
	updateAt: {
		time: {type: Date},
		explain: String,
	}
});

mongoose.model ('costs', costsSchema);