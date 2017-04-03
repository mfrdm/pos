var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Checkin();

function Checkin() {

	this.readCheckin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers";
		var view = 'checkin';
		var qs = {firstname:"tuan"};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Checkin for Customers",
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

	this.checkin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/orders/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		body.customerId = req.params.cusid;
		var send = function(req, res, view, data, cb){
			var apiUrl = apiOptions.server + '/customers/customer/' + data.customerId + '/edit';
			var view = null;
			var dataFilter = null;
			var body = {$push: {"order":{"orderId":data._id}}};
			var send = function(req, res, view, data, cb){
				requestHelper.sendJsonRes(res, 200, data)
			}
			requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.updateCheckin = function(req, res) {

	};

};