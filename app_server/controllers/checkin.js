var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();

module.exports = new Checkin();

function Checkin() {
	//Read the main checkin page - show all current customers checked in
	this.readCheckin = function(req, res) {
		var data = {
			user: {
			},
			look:{
				title:"Checkin for Customers",
				css:[''],
				js:['checkin/checkin.angular.js', 'checkin/controller.angular.js', 'checkin/service.angular.js']
			}
		};
		res.render('layout', {data:data})
	};
	//Call api get all customers who checked in - call after readCheckin
	this.readSomeCusCheckin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/orders";
		var view = null;
		var qs = {
			queryInput: JSON.stringify({
				conditions: {status:1},
				projection: null,
				opts: null
			})
		};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Checkin for Customers",
					css:[''],
					js:['']
				}
			};
			return data;
		};
		var send = function(req, res, view, data, cb){
			requestHelper.sendJsonRes(res, 200, data)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};
	//Render ng-view main checkin
	this.readMainCheckin = function(req, res) {
		var data = {
			user: {
			},
			look:{
				title:"Checkin for Customers",
				css:['']
			}
		};
		res.render('checkin/mainCheckin', {data:data})
	};
	//Render page contains one customer to check in for him/her
	this.readOneCusCheckin = function(req, res){
		var data = {
			user: {
			},
			look:{
				title:"Checkin for Customers",
				css:[''],
				js:['checkin/checkin.angular.js']
			}
		};
		res.render('checkin/cusCheckin', {data:data})
	}

	this.checkin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/orders/create";
		var view = null;
		var body = req.body;
		var dataFilter = null;
		body.customerId = req.params.cusId;

		var send = function(req, res, view, data, cb){
			console.log('check')
			console.log(data.customers.customerId);
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

	this.readOneCusCheckout = function(req,res){
		var data = {
			user: {
			},
			look:{
				title:"Checkout for Customers",
				css:[''],
				js:['checkin/checkin.angular.js']
			}
		};
		res.render('checkin/cusCheckout', {data:data})
	}

	this.readOneCusEdit = function(req, res){
		var data = {
			user: {
			},
			look:{
				title:"Edit for Customers Checkin",
				css:[''],
				js:['checkin/checkin.angular.js']
			}
		};
		res.render('checkin/cusEdit.pug', {data:data})
	}
};