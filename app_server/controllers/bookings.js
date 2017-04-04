var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Booking();

function Booking() {

	this.readBooking = function(req, res) {
		var apiUrl = apiOptions.server + "/api/bookings";
		var view = null;
		var qs = {};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Booking",
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

	this.booking = function(req, res) {
		var apiUrl = apiOptions.server + "/api/bookings/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		body.customerId = req.params.cusid;
		body.checkinTime = Date.now();
		body.storeId = '123';
		var send = function(req, res, view, data, cb){
			var apiUrl = apiOptions.server + '/customers/customer/' + data.customerId + '/edit';
			var view = null;
			var dataFilter = null;
			var body = {$push: {"booking":{"bookingId":data._id}}};
			var send = function(req, res, view, data, cb){
				requestHelper.sendJsonRes(res, 200, data)
			}
			requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

	this.updateBooking = function(req, res) {
		var apiUrl = apiOptions.server + "/api/bookings/booking/"+req.params.cusid+"/edit";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.postApi(req, res, apiUrl, view, body, dataFilter, send);
	};

};