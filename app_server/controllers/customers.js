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
		// sanitize
		req.body.data.firstname = validator.trim (req.body.data.firstname);
		req.body.data.middlename = validator.trim (req.body.data.middlename);
		req.body.data.lastname = validator.trim (req.body.data.lastname);
		req.body.data.phone = validator.trim (req.body.data.phone);
		req.body.data.email = validator.trim (req.body.data.email);

		if (!validator.isEmail (req.body.data.email)){
			next (new Error ('Invalid email: ' + req.body.data.email));
			return
		};

		if (!validator.isMobilePhone (req.body.data.phone, 'vi-VN')){
			next (new Error ('Invalid phone: ' + req.body.data.phone));
			return
		};

		var newCustomer = new Customers (req.body.data);

		newCustomer.save (function (err, cus){
			if (err){
				next (err);
				return 
			}
			else{
				res.json ({data: cus});
				return
			}
		});

	};

	this.updateOneCustomer = function(req, res) {
		//
	};

};