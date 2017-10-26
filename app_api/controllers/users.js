var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var Users = mongoose.model('users');

module.exports = new UserCtrl();

function UserCtrl() {

	this.readSomeUsers = function(req, res) {
		dbHelper.findSome(req, res, Users)
	};

	this.readOneUserById = function(req, res) {
		dbHelper.findOneById(req, res, Users, 'uId')
	};

	this.createOneUser = function(req, res) {
		dbHelper.insertOne(req, res, Users);
	};

	this.updateOneUserById = function(req, res) {
		dbHelper.updateOneById(req, res, Users, 'uId')
	};

	this.deactivate = function (req, res, next){

	};

	this.activate = function (req, res, next){

	};

};