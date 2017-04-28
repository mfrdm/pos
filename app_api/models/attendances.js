var mongoose = require('mongoose');

var attendancesSchema = mongoose.Schema({
	employeeId: {type:mongoose.Schema.Types.ObjectId},
	firstname: String,
	lastname: String,
	email: String,
	phone: String,
	workingTime:[
		{
			startTime: Date,
			endTime: Date
		}
	],
	createdAt: {type: Date, default: Date.now},
	updateAt: [{
		time: Date,
		explain: String, 
		by: mongoose.Schema.Types.ObjectId,
	}]
});

mongoose.model ('attendances', attendancesSchema);