var mongoose = require ('mongoose');

var comboOrdersSchema = new mongoose.Schema ({
	orderline: [
		{
			quantity: Number,
			value: String, // combo value
			_id: mongoose.Schema.Types.ObjectId,
			expired: Date,
		}
	],
	product: {
		_id: mongoose.Schema.Types.ObjectId,
		name: String,
	},
	total: Number,
	location: mongoose.Schema.Types.ObjectId, 
	createdAt: {type: Date, default: Date.now},
	status: {type: Number, default: 1},
});

