var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var CustomersModel = mongoose.model('customers');

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
		var input = req.body.data;
		if (typeof input == 'string'){
			input = JSON.parse (input);
		}
		
		fixedInput = [];
		input.map (function (x, i, arr){
			var newX = new Customers (x);
			newX.setPassword (x.password);
			fixedInput.push (newX);
		});

		Customers.insertMany (fixedInput, function (err, data){
			if (err){
				console.log (err);
				console.log (fixedInput)
				next (err);
				return
			}

			console.log (data.length)
			res.json ({data: data.length});

		})
	}

};