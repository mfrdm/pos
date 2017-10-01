var mongoose = require('mongoose');
var Accounts = mongoose.model ('Accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');

module.exports = new AccountCtrl ();

function AccountCtrl (){
	this.readSomeByOneCustomer = function (req, res, next){
		var fullname = req.query.fullname;

		Customers.find ({fullname: {$regex: fullname.toUpperCase ()}}, {accounts: 1, fullname: 1}, function (err, foundCustomers){
			if (err){
				next (err);
				return;
			}

			var accids = [];
			foundCustomers.map (function (x, i, arr){
				accids = accids.concat (x['accounts']);
			});

			function _getCustomerName (_id){
				var num = foundCustomers.length;
				for (var i = 0; i < num; i++){
					console.log (_id, foundCustomers[i]._id, foundCustomers[i].fullname)
					if (foundCustomers[i]._id.toString () == _id){
						return foundCustomers[i].fullname;
					}
				}	

				return ''		
			}


			if (accids.length){
				Accounts.find (
					{_id: {$in: accids}, 
					end: {$gte: new Date ()}, 
					$or: [{amount: {$gt: 0}}, {$and: [{'recursive.isRecursive': true}, {amount: {$lte: 0}}]}]
				}, function (err, foundAcc){
					if (err){
						next (err);
						return;
					}

					results = []
					foundAcc.map (function (x, i, arr){
						result = {
							customer: {
								fullname: _getCustomerName (x['customer']['_id'].toString ()), 
								_id: x['customer']['_id'],
							},
							amount: x['amount'],
							end: x['end'],
							name: x['name']
						};

						results.push (result);
					});

					res.json ({data: results})

				});
			}
			else{
				res.json ({});
			}
		});		
	};	
};