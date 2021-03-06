var mongoose = require ('mongoose');
var Bookings = mongoose.model ('bookings');
var moment = require ('moment');

module.exports = new BookingCtrl();

function BookingCtrl() {

	 // get only checked-in and pendding of all day
	this.readAllBookings = function (req, res, next){
		var stmt = {
			status: {$in: req.query.status},
			'location._id': req.query.storeId,
		};

		// default
		if (!req.query.checkinTime) {
			stmt.checkinTime = {
				$gte: moment ().hour (0).minute (0)
			}
		}	

		var q = Bookings.find (stmt);	

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
	}

	this.readSomeBookings = function(req, res, next) {
		var today = moment ();
		var start = req.query.start ? new Date (req.query.start) : new Date (today.format ('YYYY-MM-DD'));
		var end = req.query.end ? new Date (req.query.end + ' 23:59:59') : new Date (today.format ('YYYY-MM-DD') + ' 23:59:59');

		var q = Bookings.find (
			{
				checkinTime: {
					$gte: start, 
					$lte: end,
				},
				"location._id": req.query.storeId,
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
		var bookingId = req.params.bookingId;
		Bookings.findOneAndUpdate ({_id: bookingId}, req.body, {new: true}, function (err, updatedBooking){
			if (err){
				console.log (err);
				next (err); 
				return
			}

			res.json ({data: updatedBooking});
		})
	};

};