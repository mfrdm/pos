var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var DeptsModel = mongoose.model('depts');

module.exports = new Depts();

function Depts() {

	this.readSomeDepts = function(req, res) {
		var func = function(q){
			q.conditions = {
				name: "pr"
			}
			return q;
		}
		dbHelper.findSome(req, res, DeptsModel, func)
	};

	this.readOneDeptById = function(req, res) {
		dbHelper.findOneById(req, res, DeptsModel, 'deptid')
	};

	this.createOneDept = function(req, res) {
		dbHelper.insertOne(req, res, DeptsModel)
	};

	this.updateOneDeptById = function(req, res) {
		dbHelper.updateOneById(req, res, DeptsModel, 'deptid')
	};

};