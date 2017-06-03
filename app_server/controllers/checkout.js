var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Occupancy = mongoose.model ('occupancy');
var Accounts = mongoose.model ('accounts');

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Occupancy.findOne ({_id: req.params.occId}, {location: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			foundOcc.checkoutTime = foundOcc.checkoutTime ? foundOcc.checkoutTime : moment ();
			foundOcc.getTotal ();

			// Be aware that the cus is plain javascript object
			Customers.findOne ({_id: foundOcc.customer._id})
				.populate ({
					path: 'accounts',
					match: 	{
						start: {$lte: new Date ()},
						end: {$gte: new Date ()},
						amount: {$gt: 0}
					},
					select: 'amount service unit'
				}) 
				.exec (function (err, cus){
					foundOcc = foundOcc.toObject ();
					foundOcc.accounts = cus.accounts;
					res.json ({data: foundOcc});
				});

			
		})
	
	};

	// assume call createInvoice beforehand
	// at this moment only allow paid by one account at a checkout time
	// Apply only usage account, whose unit is hour
	this.usePrePaid = function (req, res, next){
		var accountId = req.query.accountId;
		var occId = req.query.occId;

		Accounts.findOne ({_id: accountId}, function (err, acc){
			if (err) {
				console.log (err);
				next (err);
			}

			Occupancy.findOne ({_id: occId}, {location: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
				if (err){
					// console.log (err);
					next (err);
					return
				}

				console.log (foundOcc)

				foundOcc.usage = foundOcc.getUsageTime ();	
				foundOcc.usage = acc.withdraw (foundOcc.usage, 'hour', foundOcc.service.name.toLowerCase ());

				foundOcc.getTotal ();
				res.json ({data: foundOcc});

			});		
		});

	};

	this.confirmCheckout = function(req, res, next) {
		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var checkoutTime = req.body.data.checkoutTime;
		
		var note = req.body.data.note ? req.body.data.note : ''; // optional
		var status = 2;

		// if account exist and valid, then use the account pay for the

		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				next (err)
				return
			}
			else{

				var updateOcc = {
					status: status, 
					total: total, 
					usage: usage, 
					checkoutTime: 
					checkoutTime, 
					note: note
				}

				Occupancy.findOneAndUpdate ({_id: req.body.data._id}, {$set: updateOcc}, {new: true, fields: {updatedAt: 0, orders: 0, staffId: 0, location: 0, createdAt: 0, bookingId: 0}}, function (err, occ){
					if (err){
						next (err)
						return
					}

					if (occ && Object.keys (occ).length){
						res.json ({data: occ});
					}
					else{
						next ();
					}

				})
			}
		})
		
	};
};