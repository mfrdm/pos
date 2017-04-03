var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var BookingModel = mongoose.model('bookings');


module.exports = new Booking();

function Booking() {

	this.readSomeBookings = function(req, res) {
		///////// validate query input
		// Check if required input is provided 
		if (!req.query.start || !req.query.end){
			requestHelper.sendJsonRes (res, 400, {message: 'Empty required inputs'});
			return
		}

		// check if start date and end date are in correct format
		// FIX
		function checkDateTimeFormat (t){
			if (t == 'invalid value') return false
			return true
		}

		if (!checkDateTimeFormat(req.query.start)|| !checkDateTimeFormat(req.query.end)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid input'});
			return
		}

		// Check start date <= end date
		if (new Date(req.query.start) > new Date (req.query.end)){
			requestHelper.sendJsonRes (res, 400, {message: 'Start date must be less than or equal end date'});
			return
		}

		dbHelper.findSome (req, res, BookingModel);
	};

	this.readOneBookingById = function(req, res) {

		req.query.attrs = 'checkinTime checkoutTime userId storeId';
		req.query.idName = 'bookingId';

		dbHelper.findOneById (req, res, BookingModel);
	};

	this.createOneBooking = function(req, res) {
		/////// Validate input
		// Check if required input is provided
		if (!req.body.customerId || !req.body.productId || !req.body.checkinTime || !req.body.storeId){
			requestHelper.sendJsonRes (res, 400, {message: 'Not provide enough input'});
			return
		}

		// Check if input is in correct format
		// FIX
		function checkCheckinTime (t){
			if (t == 'invalid value') return false
			return true
		}

		if (checkCheckinTime(req.body.checkinTime)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid input'});
			return
		}

		dbHelper.insertOne (req, res, BookingModel);
	};

	this.updateOneBookingById = function(req, res) {
		////////// Validate input
		// Check if required input is provided
		if (!req.body.userId) {
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid input'});
			return			
		}

		// check user permission to update
		// FIX
		function checkUserPermission (userId){
			if (userId == 'invalid value') return false
			return true
		}

		if (!checkUserPermission(req.body.userId)){
			requestHelper.sendJsonRes (res, 403, {message: 'No permission'});
			return	
		}

		// check checkinTime valid
		// FIX
		function checkCheckinTime (t){
			if (t == 'invalid value') return false
			return true
		}

		if (!checkCheckinTime (req.body.checkinTime)){
			requestHelper.sendJsonRes (res, 400, {message: 'Invalid input'});
			return			
		}

		res.json ({});

	};

};