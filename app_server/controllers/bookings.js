var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Booking();

function Booking() {

	this.readBooking = function(req, res) {
		// TEST client
		var fullName = ['Pham A', 'Pham B', 'Pham C', 'Pham D'];
		var customerId = [122, 332, 323, 323];
		var checkinTime = ['2017-01-02 10:15:00', '2017-01-02 10:15:00', '2017-01-02 10:15:00', '2017-01-02 10:15:00'];
		var checkoutTime = ['2017-01-02 10:15:00', '', '', '2017-01-02 10:15:00'];
		var storeAddr = ['70 Chua Lang', '70 Chua Lang', '70 Chua Lang', '70 Chua Lang']; 
		var productName = [1,1,1,1];
		var status = [1,1,1,1];
		var createdAt = ['2017-01-02 8:15:00','2017-01-02 8:15:00','2017-01-02 8:15:00','2017-01-02 8:15:00'];
		var updatedAt = ['2017-01-02 8:15:00','2017-01-02 8:15:00','2017-01-02 8:15:00','2017-01-02 8:15:00'];
		var message = ['Need a private place', 'Need a private place', '', ''];

		var d = [];

		for (var i = 0; i < customerId.length; i++){
			d.push ({
				fullName: fullName[i],
				customerId: customerId [i],
				checkinTime: checkinTime [i],
				checkoutTime: checkoutTime [i],
				storeAddr: storeAddr[i],
				productName: productName[i],
				status: status[i],
				createdAt: createdAt[i],
				updatedAt: updatedAt[i],
				message: message[i]
			});
		}

		// TESTING
		var data = {
			user:{

			},
			data: d,
			look:{
				title:"Booking",
				css:[],
				js:[]
			}
		};	
				
		res.render ('booking', {data: data});



		// var apiUrl = apiOptions.server + "/api/bookings";
		// var view = null;
		// var qs = {};
		// var dataFilter = function(dataList){
		// 	var data = {
		// 		user: {
		// 			data:dataList
		// 		},
		// 		look:{
		// 			title:"Booking",
		// 			css:['']
		// 		}
		// 	};
		// 	return data;
		// };
		// var send = function(req, res, view, data, cb){
		// 	requestHelper.sendJsonRes(res, 200, data)
		// }
		// requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
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