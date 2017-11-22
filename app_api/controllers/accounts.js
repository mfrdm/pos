var mongoose = require('mongoose');
var Accounts = mongoose.model ('Accounts');
var Customers = mongoose.model ('customers');
var moment = require ('moment');
var CustomersCtrl = require ('../../app_server/controllers/customers');

module.exports = new AccountCtrl ();

function AccountCtrl (){
	this.readSomeByOneCustomer = function (req, res, next){
		var fullname = req.query.fullname;
		fullname = req.query.fullname.split ('/');
		var customerCond = []	
		fullname.map (function (x, i, arr){
			name = x.toUpperCase ();
			customerCond.push (new RegExp (name))
		});

		Customers.find ({fullname: {$in: customerCond}}, {accounts: 1, fullname: 1}, function (err, foundCustomers){
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
							createdAt: x['createdAt'],
							start: x['start'],
							end: x['end'],
							name: x['name']
						};

						results.push (result);
					});

					res.json ({data: results})

				});
			}
			else{
				res.json ({data: []});
			}
		});		
	};

	this.depositCash = function (req, res, next){
		// both deposit and withdraw cash
		function cb (cus){
			if (!cus){
				next ();
			}else{
				var conditions = {'customer._id': cus._id, 'name': 'cash'};
				var update = {$inc: {amount: req.body.acc.amount}};
				Accounts.update (conditions, update, function (err, result){
					if (err){
						next (err);
						return;
					}
					res.sendStatus (200);
				});			
			}
		}

		req.query.fullname = req.body.cus.fullname;
		req.query.email = req.body.cus.email;
		req.query.phone = req.body.cus.phone;
		CustomersCtrl.findOneByContact (req, res, next, cb);
	}

};