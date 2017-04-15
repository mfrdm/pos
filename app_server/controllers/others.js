var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {

	this.readHome = function(req, res) {
		var files = ['checkin', 'checkout', 'customer']
		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:[],
				js:['route.angular.js']
			}
		};
		for (var i=0; i<files.length; i++){
			data.look.js.push(files[i]+'/controller.angular.js')
			data.look.js.push(files[i]+'/service.angular.js')
		};
		res.render('layout', {data:data})
	};

};