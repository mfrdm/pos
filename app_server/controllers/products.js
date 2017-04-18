var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Products ();

function Products () {

	this.readSomeProducts = function(req, res) {
		var apiUrl = apiOptions.server + '/api/products/';
		var view = 'products';
		requestHelper.readApi (req, res, apiUrl, view);
	};

	this.readOneProductById = function(req, res) {
		var apiUrl = apiOptions.server + '/api/products/product/' + req.params['productId'];
		var view = 'products';
		requestHelper.readApi (req, res, apiUrl, view);
	};

	this.createOneProduct = function(req, res) {
		var apiUrl = apiOptions.server + '/api/products/create';
		var view = 'products';
		requestHelper.postApi (req, res, apiUrl, view);
	};

	this.updateOneProduct = function(req, res) {
		var apiUrl = apiOptions.server + '/api/products/product/' + req.params['productId'] + '/edit';
		var view = 'products';
		requestHelper.postApi (req, res, apiUrl, view);
	};

	//Angular
	this.readSearchProduct = function(req, res){
		helper.angularRender(req, res, 'products/searchProduct')
	}

	this.readCreateProduct = function(req, res){
		helper.angularRender(req, res, 'products/createProduct')
	}

	this.readEditProduct = function(req, res){
		helper.angularRender(req, res, 'products/editProduct')
	}

	this.readProfileProduct = function(req, res){
		helper.angularRender(req, res, 'products/profileProduct')
	}

};