var validator = require ('validator');
var mongoose = require ('mongoose');
var Orders = mongoose.model ('orders');
var Occupancy = mongoose.model ('occupancy')
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var moment = require ('moment');

module.exports = new OrdersCtrl();

function OrdersCtrl() {
	this.createAnOrder = function (){
		
	};

	this.readOrders = function (){

	};

	this.readAnOrder = function (){

	};

	this.updateAnOrder = function (){
		
	};
}