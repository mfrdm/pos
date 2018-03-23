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
				res.status (400);
				res.json ({message: 'Input required.'});
		};

		if (checkAccountCreated (req.body)){
				res.status (400);
				res.json ({message: 'The account has been created.'});
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
					res.json ({token: token});
				}
			});
		}
		catch (err) {
			console.log (err);
			next (err);
		}
	};

	this.login = function (req, res, next) {
		// if (req.query['allowed'] != 'true'){ // should remove. 
		// 	next ();
		// 	return;
		// }

		passport.authenticate ('local', function (err, user, info){
			var token;
			if (err) next (err);
			if (user) 	{
				token = user.generateJwt ();
				res.json ({token: token});
			}
			else {
				res.status (401);
				res.json ({message: info});
			}
		}) (req, res);
	};

	this.changePwd = function (req, res, next) {
		var user = new Users (req.body);
		user.setPassword (req.body.password);
		Users.update ({_id: user._id}, {$set: {hash: user.hash, salt: user.salt}}, function (err, docs){
			if (err){
				next;
				return
			}

			token = user.generateJwt ();
			res.json ({token: token});
		});
	};
}