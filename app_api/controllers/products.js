var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var ProductsModel = mongoose.model('products');

module.exports = new Products();

function Products() {

	this.readSomeProducts = function(req, res) {
		var func = function(q){
			q.conditions = {
				name: "phong"
			}
			return q;
		}
		dbHelper.findSome(req, res, ProductsModel, func)
	};

	this.readOneProductById = function(req, res) {
		dbHelper.findOneById(req, res, ProductsModel, 'productid')
	};

	this.createOneProduct = function(req, res) {
		dbHelper.insertOne(req, res, ProductsModel)
	};

	this.updateOneProductById = function(req, res) {
		dbHelper.updateOneById(req, res, ProductsModel, 'productid')
	};

};