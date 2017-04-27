var mongoose = require('mongoose');

var promocodesSchema = mongoose.Schema ({
	name: {type: String, required: true},
	start: {type: Date, required: true},
	end: {type: Date, required: true},
	desc: {type: String}, // describe what is the promotion about
	promoType: {type: Number, default: 1}, // default: apply to one
});

mongoose.model ('promocodes', promocodesSchema);