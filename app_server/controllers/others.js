var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var request = require('request');
var apiOptions = helper.getAPIOption();

module.exports = new Others();

function Others() {

	this.getNewBookingTemplate = function (req, res, next){
		res.render ('newBookings');
	};

	this.getNewCheckinTemplate = function (req, res, next){
		res.render ('newCheckin');
	};

	this.getNewOrdersTemplate = function (req, res, next){
		res.render ('newOrders');
	};

	this.getNewCustomersTemplate = function (req, res, next){
		res.render ('newCustomers');
	};	

	this.getDepositTemplate = function (req, res, next){
		res.render ('deposit');
	};

	this.getStorageTemplate = function(req, res, next){
		res.render('storage')
	}

	this.getPromocodesTemplate = function(req, res, next){
		res.render('promocodes')
	}

	this.getTransactionTemplate = function(req, res, next){
		res.render('transaction')
	}

	this.angularApp = function (req, res){

		// load company and dept data and sent to client

		var ctrFileNames = ['layout', 'newCheckin', 'checkout','products', 'assets', 'costs', 'home', 'depts', 'employees', 'login', 'register', 'newBooking', 'attendance', 'newOrders', 'newCustomers', 'deposit', 'storage', 'promocodes', 'transaction'];
		var serviceFileNames = ['common', 'checkin', 'checkout', 'products','customers', 'assets', 'costs', 'home', 'depts','employees','authentication', 'socket', 'attendance', 'booking', 'other', 'combo', 'order', 'deposit', 'storage', 'promocodes', 'transaction'];
		var directiveFileNames = ['components'];
		var filterFileNames = ['myFilter'];

		var ctrlNum = ctrFileNames.length;
		var filterNum = filterFileNames.length;
		var serNum = serviceFileNames.length;
		var directiveNum = directiveFileNames.length;

		var data = {
			user:{

			},
			look:{
				title:"Home Page",
				css:['common', 'layout'],
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

		for (var i=0; i < filterNum; i++){
			data.look.js.push ('common/directives/' + filterFileNames[i] + '.filter.js');
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