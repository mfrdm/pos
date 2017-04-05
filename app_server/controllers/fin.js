var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Fin();

function Fin() {

	this.readSomeCosts = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/';
		var view = 'costManagement';
		requestHelper.readApi (req, res, apiUrl, view);
	};

	this.readOneCostById = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/cost/' + req.params['costId'];
		var view = 'costManagement';
		requestHelper.readApi (req, res, apiUrl, view);
	};

	this.createOneCost = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/create';
		var view = 'costManagement';
		requestHelper.postApi (req, res, apiUrl, view);
	};

	this.updateOneCost = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/cost/' + req.params['costId'] + '/edit';
		var view = 'costManagement';
		requestHelper.postApi (req, res, apiUrl, view);
	};

};