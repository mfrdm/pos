process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Deposits = require ('../../app_api/models/deposit.model');
var moment = require ('moment');

describe ('Deposits Model', function (){
	// retest since change a lot the model
	describe ('Withdraw', function (){
		var deposit, checkout;
		beforeEach (function (){
			account = {
				name: 'combo24h1d_common',
				price: 80000, // 
				amount: 24,
				unit: 'hour',
				services: ['group common', 'individual common'],
				recursive: {
					isRecursive: false,
				},				
			};

			deposit = {
				account: account,
				parent: {},
				start: moment().hour (0).minute (0),
				end: moment().hour (23).minute (59),
				customer: {
					isStudent: false,
				}
			}

			paid = {
				amount: 10,
				unit: 'hour',
				service: 'group common'
			}

		})

		it ('Should withdaw nothing when amount in deposit is 0', function (){
			deposit.account.amount = 0;
			var d = new Deposits (deposit);
			var amount = d.withdraw (paid.amount, paid.unit, paid.service);

			amount.should.to.equal (10);
		})

		it ('should withdraw all in deposit when required amount exceeds or equals amount in deposit and update deposit', function (){
			var d = new Deposits (deposit);
			paid.amount = 30;
			var amount = d.withdraw (paid.amount, paid.unit, paid.service);

			amount.should.to.equal (6);
			d.account.amount.should.to.equal (0);
		});

		it ('should withdraw and update deposit when required amount is less than amount in deposit', function (){
			var d = new Deposits (deposit);
			paid.amount = 2;
			var amount = d.withdraw (paid.amount, paid.unit, paid.service);

			amount.should.to.equal (0);
			d.account.amount.should.to.equal (22);			
		})

		it ('should not withdraw anything and return original required amount when unit is not that in deposit');


		it ('should be valid when being a `all` deposit');


	});

	xdescribe ('Discount', function (){
		var account, deposit;
		beforeEach (function (){
			account = {
				name: 'combo24h1d_common',
				price: 80000, // 
				amount: 24,
				unit: 'hour',
				services: ['group common', 'individual common'],
				recursive: {
					isRecursive: false,
				},				
			};

			deposit = {
				account: account,
				parent: {},
				start: moment().hour (0).minute (0),
				end: moment().hour (23).minute (59),
				customer: {
					isStudent: false,
				}
			}
		});

		it ('should get correct discount for deposit combo 1 day for common service when a group of customers purchases together and the customer is not a student', function (){
			deposit.parent.memNumber = 3;
			var d = new Deposits (deposit);

			d.account.price.should.to.equal (account.price);
			d.discount ();
			d.account.price.should.to.equal (69000)

		});

		it ('should get correct discount for deposit combo 1 day for common service when a group of customers purchases together and the customer is a student', function (){
			deposit.parent.memNumber = 3;
			deposit.customer.isStudent = true;
			var d = new Deposits (deposit);

			d.account.price.should.to.equal (account.price);
			d.discount ();
			d.account.price.should.to.equal (49000);

		});

	});


})