var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var TransModel = mongoose.model('transactions');

module.exports = new Transactions();

function Transactions () {

	this.readSomeTrans = function(req, res) {
		// TESTING
		// var amount = [100000, 200000, 2000000, 3000000];
		// var desc = ['For open day','For open day', 'For open day', 'For open day'];
		// var costType = [1,3,4,5];
		// var createdAt = ['2017-01-03', '2017-01-03', '2017-01-03', '2017-01-03'];
		// var updatedAt = ['2017-01-03', '2017-01-03', '2017-01-03', '2017-01-03'];	

		// var d = [];

		// for (var i = 0; i < amount.length; i++){
		// 	d.push ({
		// 		amount: amount [i],
		// 		desc: desc [i],
		// 		costType: costType [i],
		// 		createdAt: createdAt[i],
		// 		updatedAt: updatedAt[i]
		// 	});
		// }

		// res.json (d)
		// return

		// END

		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.end || !data.start) return false
			return true
		}

		// FIX
		function checkDateFormat (data){
			if (data.start == 'invalid format' || data.end == 'invalid format') return false
			return true
		}

		// FIX
		function checkStartEndDate (data){
			if (new Date(data.start) > new Date (data.end)) return false
			return true
		}

		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}		

		if (!checkProvidRequiredInput(req.query)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkDateFormat(req.query)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid format'});
			return
		}

		if  (!checkStartEndDate(req.query)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid value'});
			return
		}

		if (!checkUserPermission(req.query.userId)){
			requestHelper.sendJsonRes (res, 400, {message: 'No permission'});
			return
		}

		dbHelper.findSome (req, res, TransModel);

	};

	this.readOneTransById = function(req, res) {
		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId) return false
			return true
		}

		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		if (!checkProvidRequiredInput(req.query)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkUserPermission(req.query.userId)){
			requestHelper.sendJsonRes (res, 400, {message: 'No permission'});
			return
		}

		dbHelper.findOneById (req, res, TransModel, 'costId');
	};

	this.createOneTrans = function(req, res) {
		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.amount || !data.costType) return false
			return true
		}

		// FIX
		function checkInputFormat (data){
			if (data.amount == 'invalid format' || data.costType == 'invalid format') return false
			return true
		}

		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		if (!checkProvidRequiredInput(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkInputFormat(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid format'});
			return			
		}
		
		if (!checkUserPermission(req.body.userId)){
			requestHelper.sendJsonRes (res, 400, {message: 'No permission'});
			return
		}

		dbHelper.insertOne (req, res, TransModel);
	};

	this.updateOneTransById = function(req, res) {
		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.amount || !data.costType) return false
			return true
		}

		// FIX
		function checkInputFormat (data){
			if (data.amount == 'invalid format' || data.costType == 'invalid format') return false
			return true
		}

		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		if (!checkProvidRequiredInput(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkInputFormat(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid format'});
			return			
		}
		
		if (!checkUserPermission(req.body.userId)){
			requestHelper.sendJsonRes (res, 400, {message: 'No permission'});
			return
		}

		dbHelper.updateOneById(req, res, TransModel, 'transId');
	};

};