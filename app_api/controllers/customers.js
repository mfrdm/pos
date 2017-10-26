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

	this.report = function (req, res, next){
		// get number of new customer
		// get number by schools and others
		var startHasMin = req.query.start ? (req.query.start.split (' ').length > 1 ? true : false) : false;
		var endHasMin = req.query.end ? (req.query.end.split (' ').length > 1 ? true : false) : false;

		var start = req.query.start ? (startHasMin ? moment (req.query.start) : moment (req.query.start).hour(0).minute(0)) : moment().hour(0).minute(0);
		var end = req.query.end ? (endHasMin ? moment (req.query.end) : moment (req.query.end).hour(23).minute(59)) : moment().hour(23).minute(59);

		// fix timezone problems
		start = new Date (start);
		end = new Date (end);

		var conditions = {
			createdAt: {
				$gte: start, 
				$lte: end,
			},
		};

		if (req.query.storeId){
			conditions['location._id'] = req.query.storeId;
		}

		var q = Customers.find (conditions, {'edu.0.school': 1, isStudent: 1});

		q.exec(function (err, cus){
			if (err){
				console.log (err);
				next (err);
				return
			}
			else {
				var total = _count_total (cus);
				var total_by_edu = _count_total_by_edu (cus);
				res.json ({data: {total: total, edu: total_by_edu}});
			}
		}); 		


		function _count_total (customers){
			
		};

		function _count_total_by_edu (customers){

		};

	}

};