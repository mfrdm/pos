var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Checkout();

function Checkout() {

	this.readInvoice = function(req, res) {
		var apiUrl = apiOptions.server + "/api/orders/order/"+req.params.orderId;
		var view = null;
		var qs = {};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Checkout customer",
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

	this.checkout = function(req, res) {
		
		var apiUrl = apiOptions.server + "/api/orders/order/"+req.body.orderId+"/edit";
		var view = null;
		var body = {"$set":{"status":"2", "checkoutTime":Date.now()}};
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data);
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.readAngularCheckout = function(req, res){
		helper.angularRender( req, res,'checkout/Checkout')
	}
};