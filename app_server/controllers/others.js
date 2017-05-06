var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {
	this.test = function(req, res){
		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:['common'],
				js:['app.js'],
			}
		};
		res.render ('layout', {data: data});
	}

	this.angularApp = function (req, res){

		//var listFile = ['checkin', 'checkout', 'customers', 'assets', 'costs', 'home'];
		var ctrFileNames = ['checkin', 'checkout','products', 'customers', 'assets', 'costs', 'home', 'depts', 'employees', 'login', 'register', 'booking', 'attendance', 'combo'];
		var serviceFileNames = ['checkin', 'checkout', 'products','customers', 'assets', 'costs', 'home', 'depts','employees','common', 'authentication', 'socket', 'attendance', 'booking', 'other', 'combo'];
		var directiveFileNames = ['components'];

		var ctrlNum = ctrFileNames.length;
		var serNum = serviceFileNames.length;
		var directiveNum = directiveFileNames.length;

		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:['common'],
				js:['app.js'],
			}
		};

		for (var i=0; i < ctrlNum; i++){
			data.look.js.push (ctrFileNames[i] + '.ctrl.js');
		}

		for (var i=0; i < serNum; i++){
			data.look.js.push ('common/services/' + serviceFileNames[i] + '.service.js');
		}

		for (var i=0; i < directiveNum; i++){
			data.look.js.push ('common/directives/' + directiveFileNames[i] + '.directive.js');
		}		

		res.render ('layout', {data: data});
	}

	this.login = function(req, res){
		helper.angularRender(req, res, 'login')
	}

	this.register = function (req, res){
		res.render ('register');
	}

	this.getMessageTemplate = function (req, res) {
		res.render ('components/message');
	}

	this.getAssetTemplate = function (req, res) {
		res.render ('components/asset');
	}

	this.readAngularAttendance = function(req, res){
		helper.angularRender(req, res, 'attendance')
	}


};