var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Depts();

function Depts() {

	this.readSomeDepts = function(req, res) {
		var apiUrl = apiOptions.server + "/api/companies/depts";
		var view = null;
		var qs = {};
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.readOneDeptById = function(req, res) {
		var apiUrl = apiOptions.server + "/api/depts/dept/"+req.params.deptid;
		var view = null;
		var qs = {};
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.createOneDept = function(req, res) {
		var apiUrl = apiOptions.server + "/api/depts/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.updateOneDept = function(req, res) {
		var apiUrl = apiOptions.server + "/api/depts/dept/"+req.params.deptid+"/edit";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	//Angular Render Page
	this.readAngularDepts = function(req, res){
		helper.angularRender(req, res, 'dept')
	}
};