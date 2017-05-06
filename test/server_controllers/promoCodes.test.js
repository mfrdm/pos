process.env.NODE_ENV = "development";

var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = mongoose.model ('promocodes');
var should = chai.should ();

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

	xdescribe ('Read some promoCodes', function (){
		it ('should return a list of promoCodes')
		it ('should returns a list of valid codes')
		it ('should be invalid when required input not found')

	})

	describe ('Read one promoCode by id', function (){
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