var helper = require('../../libs/node/helper');
var dbHelper = require('../../libs/node/dbHelper');
var requestHelper = require('../../libs/node/requestHelper');
var mongoose = require('mongoose');
var UserModel = mongoose.model ('users');
var passport = require ('passport');

module.exports = new Authentication ();

function Authentication () {
	this.register = function (req, res){
		function checkRequiredInput (data){
			if (!data.phone || !data.firstname || !data.lastname || !data.password) return false
			else return true
		}

		function checkAccountCreated (data){
			if (data.phone = 'created') return true
			else return true
		}

		if (!checkRequiredInput (req.body)) {
			console.log ('Input required')
			return requestHelper.sendJsonRes (res, 400, {message: 'Input required'});
		};

		if (checkAccountCreated (req.body)){
			return requestHelper.sendJsonRes (res, 400, {message: 'Created account'});
		}

		dbHelper.insertOne (req, res, UserModel, 
			function (user, data) {
				console.log (user)
				user.setPassword (data.password);
			},
			function (user, res, data) {
				var token = user.generateJwt ();
				requestHelper.sendJsonRes (res, 201, {token: token})
			}
		);

	};

	this.login = function (req, res) {
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