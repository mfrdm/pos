var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var DeptsModel = mongoose.model('depts');

module.exports = new Depts();

function Depts() {

	this.readSomeDepts = function(req, res) {
		dbHelper.findSome(req, res, DeptsModel)
	};

	this.readOneDeptById = function(req, res) {
		dbHelper.findOneById(req, res, DeptsModel, 'deptId')
	};

	this.createOneDept = function(req, res) {
		dbHelper.insertOne(req, res, DeptsModel)
	};

	this.updateOneDeptById = function(req, res) {
		console.log(req.body)
		dbHelper.updateOneById(req, res, DeptsModel, 'deptId')
	};

};