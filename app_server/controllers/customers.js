var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

var validator = require ('validator')
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');

module.exports = new CustomersCtrl();

function CustomersCtrl() {

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

	this.createOneCustomer = function(req, res, next) {
		var newCustomer = new Customers (req.body.data);

		// sanitize
		req.body.data.firstname = validator.trim (req.body.data.firstname);
		req.body.data.middlename = validator.trim (req.body.data.middlename);
		req.body.data.lastname = validator.trim (req.body.data.lastname);
		req.body.data.phone = validator.trim (req.body.data.phone);
		req.body.data.email = validator.trim (req.body.data.email);
		req.body.data.school = req.body.data.edu.school ? validator.trim (req.body.data.edu.school) : req.body.data.edu.school;

		if (!validator.isEmail (req.body.data.email)){
			next (new Error ('Invalid email'));
		};

		if (!validator.isMobilePhone (req.body.data.phone, 'vi-VN')){
			next (new Error ('Invalid phone'));
		};

		newCustomer.save (function (err, cus){
			if (err){
				next (err);
				return 
			}
			else{
				var data = {
					firstname: cus.firstname,
					middlename: cus.middlename,
					lastname: cus.lastname,
					_id: cus._id,
					email: cus.email [0],
					phone: cus.phone [0]
				}

				res.json ({data: cus});
			}
		});

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
	this.readAngularCustomers = function(req, res){
		helper.angularRender(req, res, 'customer')
	}
};