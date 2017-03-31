var helper = require('../../libs/node/helper')
var dbHelper = require('../../libs/node/dbHelper')
var requestHelper = require('../../libs/node/requestHelper')
var request = require('request')
var apiOptions = helper.getAPIOption()

module.exports = new Checkin();

function Checkin() {

	this.readCheckin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers";
		var view = 'checkin';
		var qs = {name:"tuan"};
		var dataFilter = function(dataList){
			var data = {
				user: {
					data:dataList
				},
				look:{
					title:"Checkin for Customers",
					css:['']
				}
			};
			return data;
		};
		var send = function(req, res, view, data, cb){
			console.log(data)
			res.render(view, data, cb)
		}
		requestHelper.readApi(req, res, apiUrl, view, qs, dataFilter, send);
	};

	this.checkin = function(req, res) {
		var apiUrl = apiOptions.server + "/api/customers?firstname=tuan";
		var view = 'checkin';
		var qs = req.query;

	};

	this.updateCheckin = function(req, res) {

	};

};