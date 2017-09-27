var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var Users = mongoose.model ('users');
var passport = require ('passport');

module.exports = new Authentication ();

function Authentication () {

	this.register = function (req, res, next){
		// /////////// NOT ALLOW TO CREATE A NEW USER ////////////
		// res.status (404);
		// res.json ({message: 'Not allow to create a new user'});
		// return
		// ////////////////////// END ////////////////////////////

		// FIX: include other required data
		function checkRequiredInput (data){
			if (!data.phone || !data.firstname || !data.lastname || !data.password) return false
			else return true
		}

		// FIX: placeholder
		function checkAccountCreated (data){
			if (data.phone == 'created') return true
			else return false
		}

		if (!checkRequiredInput (req.body)) {
			return requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
		};

		if (checkAccountCreated (req.body)){
			return requestHelper.sendJsonRes (res, 400, {message: 'Created account'});
		}

		try {
			var user = new Users (req.body);
			user.setPassword (req.body.password);
			user.save (function (err, data){
				if (err) {
					console.log (err);
					next (err);
				}
				else {
					var token = user.generateJwt ();
					requestHelper.sendJsonRes (res, 200, {token: token})					
				}
			});
		}
		catch (err) {
			console.log (err);
			next (err);
		}
	};

	this.login = function (req, res, next) {
		// if (!req.query['allowed'] == 'true'){
		// 	next ();
		// 	return;
		// }

		passport.authenticate ('local', function (err, user, info){
			var token;
			if (err) throw new Error (err);
			if (user) 	{
				token = user.generateJwt ();
				return requestHelper.sendJsonRes (res, 200, {token: token});
			}
			else return requestHelper.sendJsonRes (res, 401, {message: info});
		}) (req, res);
	}
}