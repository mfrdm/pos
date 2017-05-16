var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

var mongoose = require ('mongoose');
var Bookings = mongoose.model ('bookings');
var moment = require ('moment');

module.exports = new BookingCtrl();

function BookingCtrl() {

	this.readSomeBookings = function(req, res, next) {
		var today = moment ();
		var start = req.query.start ? moment(req.query.start) : moment (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? moment(req.query.end + ' 23:59:59') : moment (today.format ('YYYY-MM-DD') + ' 23:59:59');

		var q = Bookings.find (
			{
				checkinTime: {
					$gte: start, 
					$lte: end,
				},
				storeId: req.query.storeId,
			});

		q.exec(function (err, bk){
				if (err){
					console.log (err);
					next (err);
					return
				}
				else {
					res.json ({data: bk});
				}
			}
		); 		
	};

	this.booking = function(req, res, next) {
		var booking = new Bookings (req.body.data);
		booking.save (function (err, bk){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (bk){
				res.json ({data: bk});
			}
			else{
				next ();
			}

		});
	};

	this.readOneBooking = function (req, res, next){
		Bookings.findOne ({_id: req.params.bookingId}, {status: 1, customer: 1, service: 1}, function (err, bk){
			if (err){
				console.log (err);
				next (err);
				return
			}

			if (bk){
				res.json ({data: bk});
				return
			}
			else{
				next ();
			}
		})
	}

	this.updateBooking = function(req, res, next) {
		// later
	};

};