var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();

module.exports = new Checkin();

function Checkin() {
	
	this.checkin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/orders/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		console.log(req.body)
		body.customerId = req.params.cusId;

		var send = function(req, res, view, data, cb){
			var apiUrl = apiOptions.server + '/api/customers/customer/' + data.customers.customerId + '/edit';
			var view = null;
			var dataFilter = null;
			console.log('check id'+ data._id + typeof data._id)
			var body = {$push: {"order":{"orderId":data._id}}};
			var send = function(req, res, view, data, cb){
				requestHelper.sendJsonRes(res, 200, data)
			}
			requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.updateCheckin = function(req, res) {
		//cusid is id of the order
		var apiUrl = apiOptions.server + "/api/orders/order/"+req.params.cusid+"/edit";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		body.customerId = req.params.cusid;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	//Render ng-view main checkin
	this.readAngularCheckin = function(req, res) {
		helper.angularRender( req, res,'checkin/Checkin')
	};
};