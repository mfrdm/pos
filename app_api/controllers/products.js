var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var ProductsModel = mongoose.model('products');

module.exports = new Products();

function Products() {

	this.readSomeProducts = function(req, res) {
		dbHelper.findSome(req, res, ProductsModel);
	};

	this.readOneProductById = function(req, res) {
		dbHelper.findOneById(req, res, ProductsModel, 'productId');
	};

	this.createOneProduct = function(req, res) {
		dbHelper.insertOne(req, res, ProductsModel);
	};

	this.updateOneProductById = function(req, res) {
		dbHelper.updateOneById(req, res, ProductsModel, 'productId');
	};

};