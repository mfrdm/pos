process.env.NODE_ENV = "test";

var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var should = chai.should ();
var moment = require ('moment');

chai.use (chaiHttp);

describe ('PromoCode', function (){
	this.timeout(3000);

	xdescribe ('Create a promoCode', function (){
		var code = {
			name: 'THANG6VUIVE',
			desc: 'Test promoCodes controller',
			start: new Date ('2017-05-25'),
			end: new Date ('2017-06-01'),
		}

		afterEach(function (done){
			Promocodes.remove ({name: code.name}, function (err, data){
				if (err){
					console.log (err)
				}

				done ();
			});
		});	

		it ('should add a new promocode successfully', function (done){
			chai.request (server)
				.post ('/promo-codes/create')
				.send ({data: code})
				.end (function (err, res){
					if (err){
						console.log (err);
					}
					else {
						res.should.have.status(200);
						res.body.data.should.to.exist;
						res.body.data.desc.should.to.exist;
						res.body.data.name.should.to.exist;
						res.body.data.createdAt.should.to.exist;

					}
					done ()
				});
		});

		it ('should be invalid when required input not found')
	});

	describe ('Read some promoCodes', function (){
		var newCodes;
		beforeEach (function (done){
			var codes = [
				{name: 'code1', start: moment(), end: moment().add (10, 'day')},
				{name: 'code2', start: moment().add(-3, 'day'), end: moment().add (-1, 'day')},
				{name: 'code3', start: moment().add(-3, 'day'), end: moment().add (10, 'day')},
				{name: 'code4', start: moment().add(-3, 'day'), end: moment().add (10, 'day')},
				{name: 'studentprice', start: moment(), end: moment().add (10, 'day'), excluded: true},
				{name: 'privatediscountprice', start: moment(), end: moment().add (10, 'day'), excluded: true},
			];

			Promocodes.insertMany (codes, function (err, c){
				if (err){
					console.log (err);
					return
				}

				newCodes = c;
				done ();
			})
		})

		afterEach (function (done){
			var ids = newCodes.map (function (x, i, arr){
				return x._id;
			})

			Promocodes.remove ({_id: {$in: ids}}, function (err, result){
				if (err){
					console.log (err);
					return
				}

				done ();
			});
		});

		it ('should returns a list of non-expired codes', function (done){
			chai.request (server)
				.get ('/promocodes')
				.end (function (err, res){
					if (err){
						console.log (err);
					}


					res.should.to.have.status (200);
					var foundCodes = res.body.data;
					foundCodes.should.have.lengthOf (3);
					done ();
				});
		});

		it ('should exclude some special codes', function (done){
			chai.request (server)
				.get ('/promocodes')
				.end (function (err, res){
					if (err){
						console.log (err);
					}


					res.should.to.have.status (200);
					var foundCodes = res.body.data;
					var excludeCodes = ['privatediscountprice', 'studentprice'];

					foundCodes.should.have.lengthOf (3);
					foundCodes.map (function (x, i, arr){
						x.name.should.to.not.equal (excludeCodes[0]);
						x.name.should.to.not.equal (excludeCodes[1]);
					});

					done ();
				});
		});
	})

	xdescribe ('Read one promoCode by id', function (){
		var code, newCode;
		beforeEach (function (done){
			code = {
				name: 'THANG6VUIVE',
				desc: 'Test promoCodes controller',
				start: new Date ('2017-05-25'),
				end: new Date ('2017-06-01'),
			}

			chai.request (server)
				.post ('/promo-codes/create')
				.send ({data: code})
				.end (function (err, res){
					if (err){
						console.log (err);
					}
					else{
						newCode = res.body.data;
					}
					
					done ();
				});

		});

		afterEach (function (done){
			Promocodes.remove ({name: newCode.name}, function (err, data){
				if (err){
					console.log (err)
					return
				}

				done ()

			});
		});

		it ('should return a code', function (done){
			chai.request (server)
				.get ('/promo-codes/code/' + newCode._id)
				.end (function (err, res){
					if (err){
						console.log (err)
					}
					else{
						res.should.have.status (200);
						res.body.data.should.to.exist;
						res.body.data.name.should.to.exist;
						res.body.data.desc.should.to.exist;
						res.body.data.createdAt.should.to.exist;
					}

					done ();

				});
		})

		// it ('should be invalid given invalid code')
	})

	xdescribe ('Update one promoCode')

});