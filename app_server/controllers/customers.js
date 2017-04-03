var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Customers();

function Customers() {

	this.readOverview = function(req, res) {

	};

	this.readSomeCustomers = function(req, res) {

	};

	this.readOneCustomerById = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers/customer/" + req.params.cusid;
		var view = 'checkin';
		var qs = {};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Return 1 specific Customer by ID",
					css:['']
				}
			};
			return data;
		};
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.createOneCustomer = function(req, res) {

	};

	this.updateOneCustomer = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers/customer/"+req.params.cusid+"/edit";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

};