process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Accounts = require ('../../app_api/models/accounts.model');
var Deposits = require ('../../app_api/models/deposit.model');
var moment = require ('moment');


describe ('Renew recursive code', function (){
	var accounts;
	beforeEach(function (){
		accounts = [
			{
				price: 350000,
				amount: 0,
				unit: 'hour',
				services: ['group common', 'individual common'],
				recursive: {
					isRecursive: true,
					lastRenew: moment ().add (-1, 'day'),
					recursiveType: 1,
					baseAmount: 3				
				}
			}

		]
	})

	it ('should renew a 3-hour-daily-a-month account when it is a recursive, amount is zero, and today is valid day to renew', function (){
		var acc = accounts[0];
		Accounts.renew (acc);

		acc.amount.should.to.equal (acc.recursive.baseAmount);
		acc.lastRenew.should.to.be.at.least (moment ().hour (0).minute (0));
	});

	it ('should not renew a 3-hour-daily-a-month account when amount is zero and it has been renew today', function (){
		var acc = accounts[0];
		acc.amount = 1;
		acc.recursive.lastRenew = moment ();
		Accounts.renew (acc);

		acc.amount.should.to.equal (1);		
	});	

	it ('should not renew an account daily if it is not of type recursive daily', function (){
		var acc = accounts[0];
		acc.amount = 1;
		acc.recursive.recursiveType = 2; 
		Accounts.renew (acc);

		acc.amount.should.to.equal (1);			
	})

	it ('should not renew account that is not recursive account', function (){
		var acc = accounts[0];
		acc.recursive.isRecursive = false;
		Accounts.renew (acc);
		acc.amount.should.to.equal (0);		
	})

});