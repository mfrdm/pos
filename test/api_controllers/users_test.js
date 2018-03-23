process.env.NODE_ENV = 'test';
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Users = mongoose.model ('users');
var moment = require ('moment');
var AuthenCtrl = require ('../../app_api/controllers/authentication');

chai.use (chaiHttp);

xdescribe ('Change password', function (){
	var auser, password;
	beforeEach (function (done){
		auser = {
			firstname: 'Hiep',
			middlename: 'Manh',
			lastname: 'Pham',
			birthday: new Date (),
			gender: 1,
			phone: '0965284281',
			email: 'hiep@gmail.com',
			role: 1		
		}

		password = '123456';

		auser = new Users (auser);
		auser.setPassword (password);
		auser.save (function (err, doc){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	})

	afterEach (function (done){
		Users.remove ({_id: auser._id}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	})

	it ('Change successfully.', function (done){
		var newPwd = 'abcdef';
		var curUser = {
			_id: auser._id,
			password: newPwd,
		}

		chai.request (server)
			.post ('/api/changePwd')
			.send (curUser)
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.to.have.status (200);
				chai.request (server)
					.post ('/api/login')
					.send ({username: 'hiep@gmail.com', password: newPwd})
					.end (function (err, res){
						if (err){
							console.log (err);
						}

						res.should.to.have.status (200);
						console.log (res.token);
						done ();
					})
			})
	});
});

describe ('Login an register account', function (){
	var auser, password;
	beforeEach (function (done){
		auser = {
			firstname: 'Hiep',
			middlename: 'Manh',
			lastname: 'Pham',
			birthday: new Date (),
			gender: 1,
			phone: '0965284281',
			email: 'hiep@gmail.com',
			role: 1		
		}

		password = '123456';

		auser = new Users (auser);
		auser.setPassword (password);
		auser.save (function (err, doc){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	})

	afterEach (function (done){
		Users.remove ({_id: auser._id}, function (err, result){
			if (err){
				console.log (err);
				return
			}

			done ();
		})
	})

	it ('Login successfully.', function (done){
		chai.request (server)
			.post ('/api/login')
			.send ({username: 'hiep@gmail.com', password: password})
			.end (function (err, res){
				if (err){
					console.log (err);
				}

				res.should.to.have.status (200);
				// console.log (res.body.token);
				done ();
			})		
	});

	it ('Login unsuccessfully.', function (done){
		var foul_password = 'xyztak';
		chai.request (server)
			.post ('/api/login')
			.send ({username: 'hiep@gmail.com', password: foul_password})
			.end (function (err, res){
				if (err){
					// console.log (err);
				}

				res.should.to.have.status (401);
				// console.log (res.body.token);
				done ();
			})				
	})
})

