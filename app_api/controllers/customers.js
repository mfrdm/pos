var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var Customers = mongoose.model('customers');

module.exports = new CustomerCtrl();

function CustomerCtrl() {

	this.readSomeCustomers = function(req, res) {
		dbHelper.findSome(req, res, CustomersModel)
	};

	this.readOneCustomerById = function(req, res) {
		dbHelper.findOneById(req, res, CustomersModel, 'cusId')
	};

	this.createOneCustomer = function(req, res) {
		dbHelper.insertOne(req, res, CustomersModel)
	};

	this.updateOneCustomerById = function(req, res) {
		dbHelper.updateOneById(req, res, CustomersModel, 'cusId')
	};

	this.createManyCustomers = function (req, res, next){
		console.log (req.body.data);

		
	}

};