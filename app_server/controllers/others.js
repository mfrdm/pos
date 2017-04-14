var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {

	this.readHome = function(req, res) {
		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:[],
				js:['route.angular.js', 'checkin/controller.angular.js', 'checkin/service.angular.js']
			}
		};
		res.render('layout', {data:data})
	};

};