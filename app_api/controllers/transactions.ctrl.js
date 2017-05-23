var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var TransModel = mongoose.model('transactions');

module.exports = new TransactionCtrl ();

function TransactionCtrl () {

	// FIX: need to regularly insert data into transaction collections
	this.readSomeTrans = function(req, res, next) {			
		//
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