var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Fin();

function Fin() {

	this.readSomeCosts = function(req, res) {
		var amount = [100000, 200000, 2000000, 3000000];
		var desc = ['For open day','For open day', 'For open day', 'For open day'];
		var costType = [1,3,4,5];
		var createdAt = ['2017-01-03', '2017-01-03', '2017-01-03', '2017-01-03'];
		var updatedAt = ['2017-01-03', '2017-01-03', '2017-01-03', '2017-01-03'];	

		var d = [];

		for (var i = 0; i < amount.length; i++){
			d.push ({
				amount: amount [i],
				desc: desc [i],
				costType: costType [i],
				createdAt: createdAt[i],
				updatedAt: updatedAt[i]
			});
		}

		// TESTING
		var data = {
			user:{

			},
			data: d,
			look:{
				title:"Cost Management",
				css:[],
				js:[]
			}
		};	
				
		res.render ('costManagement', {data: data});		


		// var apiUrl = apiOptions.server + '/api/costs/';
		// var view = 'costManagement';
		// requestHelper.readApi (req, res, apiUrl, view);
	};

	this.readOneCostById = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/cost/' + req.params['costId'];
		var view = 'costManagement';
		requestHelper.readApi (req, res, apiUrl, view);
	};

	this.createOneCost = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/create';
		var view = 'costManagement';
		requestHelper.postApi (req, res, apiUrl, view);
	};

	this.updateOneCost = function(req, res) {
		var apiUrl = apiOptions.server + '/api/costs/cost/' + req.params['costId'] + '/edit';
		var view = 'costManagement';
		requestHelper.postApi (req, res, apiUrl, view);
	};

};