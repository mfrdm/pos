process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Accounts = require ('../../app_api/models/accounts');
var moment = require ('moment');

describe ('Accounts Model', function (){
	describe ('Withdraw', function (){
		var account, checkout;
		beforeEach (function (){
			account = {
				amount: 10,
				unit: 'hour',
				services: 'group common'
			};

			checkout = {
				total: 10,
				unit: 'hour',
				service: 'group common'
			}

		})

		it ('Should withdaw nothing when amount in account is 0', function (){
			account.amount = 0;
			var acc = new Accounts (account);
			var total = acc.withdraw (checkout.total, checkout.unit, checkout.service);

			total.should.to.equal (10);
		})

		it ('should withdraw all in account when required amount exceeds or equals amount in account and update account', function (){
			var acc = new Accounts (account);
			checkout.total = 100;
			var total = acc.withdraw (checkout.total, checkout.unit, checkout.service);

			total.should.to.equal (90);
			acc.amount.should.to.equal (0);
		});

		it ('should withdraw and update account when required amount is less than amount in account', function (){
			var acc = new Accounts (account);
			checkout.total = 2;
			var total = acc.withdraw (checkout.total, checkout.unit, checkout.service);

			total.should.to.equal (0);
			acc.amount.should.to.equal (8);			
		})

		it ('should not withdraw anything and return original required amount when unit is not that in account', function (){
			var acc = new Accounts (account);
			checkout.total = 100000;
			checkout.unit = 'cash';
			var total = acc.withdraw (checkout.total, checkout.unit, checkout.service);

			total.should.to.equal (100000);
			acc.amount.should.to.equal (10);				
		});


		it ('should be valid when being a `all` account', function (){
			account.service = 'all';
			var acc = new Accounts (account);
			checkout.total = 100000;
			checkout.unit = 'cash';
			var total = acc.withdraw (checkout.total, checkout.unit, checkout.service);

			total.should.to.equal (100000);
			acc.amount.should.to.equal (10);				
		});


	});


})