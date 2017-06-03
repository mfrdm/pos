var validator = require ('validator');
var mongoose = require ('mongoose');
var Accounts = require ('accounts');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy')
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Bookings = mongoose.model ('bookings');
var moment = require ('moment');

module.exports = new AccountCtrl();

function AccountCtrl (){
	this.createOneAccount = function (req, res, next){

	}

	this.readAccountsByCustomerId = function (req, res, next){
		
	}

	this.updateOneAccount = function (req, res, next){

	}

}