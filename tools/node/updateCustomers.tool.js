var server = require ('../../bin/www');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var fastcsv = require ('fast-csv');
var request = require ('request');
var async = require ('async');

module.exports = new UpdateCustomers ();

function UpdateCustomers (){
	this.preprocess = function (data){
		customers = [];
		data.map (function (x, i, arr){
			customers.push ({
				_id: x[0],
				school: x[1]
			});			
		});

		return customers;

	}

	this.updateSchool = function (customer){
		Customers.findOneAndUpdate ({_id: customer._id}, {$set: {'edu': [{'school': customer.school}]}}, function (err, updatedCustomer){
			if (err){
				console.log (err);
				return
			}

			//
		})
	}

} 


var fpath = 'data/20170507_20170523/fixed_customers.csv';
var customers = [];
fastcsv.fromPath (fpath)
	.on ('data', function (data){
		customers.push (data);
	})
	.on ('end', function (){
		var updater = new UpdateCustomers ();
		var processedCustomers = updater.preprocess (customers.slice (1));

		async.map (processedCustomers, updater.updateSchool, function (err, result){
			// console.log (result)
		})
	})