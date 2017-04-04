var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var UserModel = mongoose.model('users');

module.exports = new Users();

function Users() {

	this.readSomeUsers = function(req, res) {
		dbHelper.findSome(req, res, UserModel)
	};

	this.readOneUserById = function(req, res) {
		dbHelper.findOneById(req, res, UserModel, 'uid')
	};

	this.createOneUser = function(req, res) {
		dbHelper.insertOne(req, res, UserModel)
	};

	this.updateOneUserById = function(req, res) {
		dbHelper.updateOneById(req, res, UserModel, 'uid')
	};

};