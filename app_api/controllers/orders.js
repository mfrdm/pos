var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var OrdersModel = mongoose.model('orders');

module.exports = new Orders();

function Orders() {

	this.readSomeOrders = function(req, res) {
		dbHelper.findSome(req, res, OrdersModel)
	};

	this.readOneOrderById = function(req, res) {
		dbHelper.findOneById(req, res, OrdersModel, 'orderid')
	};

	this.createOneOrder = function(req, res) {
		dbHelper.insertOne(req, res, OrdersModel)
	};

	this.updateOneOrderById = function(req, res) {
		dbHelper.updateOneById(req, res, OrdersModel, 'orderid')
	};

};