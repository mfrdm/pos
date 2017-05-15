var moment = require ('moment');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var Customers = mongoose.model ('customers');
var Occupancy = mongoose.model ('occupancy');

var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption();

module.exports = new Checkout();

function Checkout() {

	// assume promotion codes, if provided, are valid, since checked when checking in
	this.createInvoice = function (req, res, next){
		Occupancy.findOne ({_id: req.params.occId}, {storeId: 0, staffId: 0, updateAt: 0}, function (err, foundOcc){
			if (err){
				console.log (err);
				next (err);
				return
			}

			foundOcc.checkoutTime = foundOcc.checkoutTime ? foundOcc.checkoutTime : moment ();
			foundOcc.getTotal ();
			res.json ({data: foundOcc});
		})
	}

	this.confirmCheckout = function(req, res, next) {

		var total = req.body.data.total;
		var usage = req.body.data.usage;
		var checkoutTime = req.body.data.checkoutTime;
		var status = 2;
		Customers.findOneAndUpdate({_id:req.body.data.customer._id}, {$set:{checkinStatus:false}}, function(err, cus){
			if (err){
				next (err)
				return
			}
			else{
				Occupancy.findOneAndUpdate ({_id: req.body.data._id}, {$set: {status: status, total: total, usage: usage, checkoutTime: checkoutTime}}, {new: true, fields: {usage: 1, total: 1, status: 1, checkoutTime: 1, checkinTime: 1, customer: 1}}, function (err, occ){
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