var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var AssetsModel = mongoose.model('assets');

module.exports = new Assets();

function Assets() {

	this.readSomeAssets = function(req, res, next) {

		var names = ['table', 'cup', 'laptop', 'chair'];
		var categories = [1,2,3,1];
		var quantities = [1,3,4,5];
		var statuses = [1,1,2,2]; // quality of asset	

		var d = [];

		for (var i = 0; i < names.length; i++){
			d.push ({
				name: names [i],
				category: categories [i],
				quantity: quantities [i],
				status: statuses[i],
			});
		}

		res.json (d)
		return

		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.status) return false
			return true
		}

		// FIX
		function checkStatusFormat (status){
			if (status == 'invalid format') return false
			return true
		}

		// FIX
		function checkStatusValue (status){
			if (status == 'invalid value') return false
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

		if (!checkStatusFormat(req.query.status)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid format'});
			return
		}

		if  (!checkStatusValue(req.query.status)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid value'});
			return
		}

		if (!checkUserPermission(req.query.userId)){
			requestHelper.sendJsonRes (res, 400, {message: 'No permission'});
			return
		}

		dbHelper.findSome (req, res, AssetsModel);
	};

	this.readOneAssetById = function(req, res) {
		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.assetId) return false
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

		dbHelper.findOneById (req, res, AssetsModel, 'assetId');

	};

	this.createOneAsset = function(req, res) {
		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		// FIX
		function checkInputValue (data){
			if (data.name == 'invalid value' || data.assetCategory == 'invalid value' || data.quantity == 'invalid value' || data.status == 'invalid value') return false
			return true
		}

		// FIX
		function checkInputFormat (data){
			if (data.name == 'invalid format' || data.assetCategory == 'invalid format' || data.quantity == 'invalid format' || data.status == 'invalid format') return false
			return true
		}

		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.quantity || !data.assetCategory || !data.status || !data.name) return false
			return true
		}

		if (!checkProvidRequiredInput(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkInputValue(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid value'});
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

		dbHelper.insertOne (req, res, AssetsModel);

	};

	this.updateOneAssetById = function(req, res) {
		// FIX
		function checkUserPermission (userId){
			if (userId == 'no permission') return false
			return true
		}

		// FIX
		function checkProvidRequiredInput (data){
			if (!data.userId || !data.quantity || !data.assetCategory || !data.status || !data.name) return false
			return true
		}

		// FIX
		function checkInputValue (data){
			if (data.name == 'invalid value' || data.assetCategory == 'invalid value' || data.quantity == 'invalid value' || data.status == 'invalid value') return false
			return true
		}

		// FIX
		function checkInputFormat (data){
			if (data.name == 'invalid format' || data.assetCategory == 'invalid format' || data.quantity == 'invalid format' || data.status == 'invalid format') return false
			return true
		}

		if (!checkProvidRequiredInput(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
			return
		}

		if (!checkInputValue(req.body)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid value'});
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

		dbHelper.updateOneById(req, res, AssetsModel, 'assetId');

	};

};