var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var mongoose = require('mongoose');
var CompaniesModel = mongoose.model('companies');

module.exports = new Companies();

function Companies() {

	this.readSomeComps = function(req, res) {
		var func = function(q){
			q.conditions = {
				name: "Gre"
			}
			return q;
		}
		dbHelper.findSome(req, res, CompaniesModel, func)
	};

	this.readOneCompById = function(req, res) {
		dbHelper.findOneById(req, res, CompaniesModel, 'compid')
	};

	this.createOneComp = function(req, res) {
		dbHelper.insertOne(req, res, CompaniesModel)
	};

	this.updateOneCompById = function(req, res) {
		dbHelper.updateOneById(req, res, CompaniesModel, 'compid')
	};

};