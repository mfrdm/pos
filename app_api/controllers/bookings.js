var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var BookingModel = mongoose.model('bookings');


module.exports = new Booking();

function Booking() {

	this.readSomeBookings = function(req, res) {
		///////// validate query input
		// validate if any required query is empty 
		if (!req.query.start || !req.query.end){
			requestHelper.sendJsonRes (res, 400, {message: 'empty required inputs'});
			return
		}

		// validate from and to datetime
		if (new Date(req.query.start) > new Date (req.query.end)){
			requestHelper.sendJsonRes (res, 400, {message: 'Start date must be less than or equal end date'});
			return
		}

		dbHelper.findSome (req, res, BookingModel);
	};

	this.readOneBookingById = function(req, res) {

	};

	this.createOneBooking = function(req, res) {

	};

	this.updateOneBookingById = function(req, res) {

	};

};