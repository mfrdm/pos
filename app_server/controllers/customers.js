var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Customers();

function Customers() {

	this.readOverview = function(req, res) {
		var data = {
			user: {
				data:dataList
			},
			look:{
				title:"Customers",
				css:['']
			}
		};
		res.render('layout', {data:data})
	};

	this.readSomeCustomers = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers/";
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

	this.readOneCustomerById = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers/customer/" + req.params.cusId;
		var view = null;
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
		var apiUrl = apiOptions.server + "/api/customers/create/";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
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

	//Angular get view
	//Render angular view for Create Customer
	this.readCreateCustomer = function(req, res){
		helper.angularRender(req, res, 'customers/createCustomer')
	}

	this.readCustomers = function(req, res){
		helper.angularRender(req, res, 'customers/searchCustomer')
	}

	this.readProfileCustomer = function(req, res){
		helper.angularRender(req, res, 'customers/infoCustomer')
	}

	this.readEditCustomer = function(req, res){
		helper.angularRender(req, res, 'customers/editCustomer')
	}
};