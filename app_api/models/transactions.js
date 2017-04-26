var mongoose = require('mongoose');

var transactions = new mongoose.Schema({
	parentCat: Number,
	childCat: Number, // has parent and child
	desc: String,
	amount: Number,
	sourceName: String, // the cause
	source: mongoose.Schema.Types.ObjectId, // if exist
	desName: String, // the receive
	des: mongoose.Schema.Types.ObjectId,
});