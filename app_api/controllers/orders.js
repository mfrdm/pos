var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var OrdersModel = mongoose.model('orders');

module.exports = new Orders();

function Orders() {

	this.readSomeOrders = function(req, res) {
		var func = function(q){
			q.conditions = {
				name: "food"
			}
			return q;
		}
		dbHelper.findSome(req, res, OrdersModel, func)
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