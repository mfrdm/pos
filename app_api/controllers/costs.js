var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var CostsModel = mongoose.model('costs');

module.exports = new Costs();

function Costs() {

	this.readSomeCosts = function(req, res) {
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

		dbHelper.findSome (req, res, CostsModel);

	};

	this.readOneCostById = function(req, res) {
		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.costId) return false
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

		dbHelper.findOneById (req, res, CostsModel, 'costId');
	};

	this.createOneCost = function(req, res) {
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

		dbHelper.insertOne (req, res, CostsModel);
	};

	this.updateOneCostById = function(req, res) {
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

		dbHelper.updateOneById(req, res, CostsModel, 'costId');
	};

};