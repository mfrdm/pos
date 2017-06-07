process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Accounts = require ('../../app_api/models/accounts.model');
var moment = require ('moment');

describe ('Renew a recursive account', function (){
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
					lastRenewDate: moment ().add (-1, 'day'),
					recursiveType: 1,
					renewNum: 0,
					maxRenewNum: 3,
					baseAmount: 3				
				}
			},
		]
	})

	it ('should renew an account when it is a recursive and last review is not today, and maxRenewNum > renewNum', function (){
		var acc = accounts[0];
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.equal (newAcc.recursive.baseAmount);
		newAcc.lastRenew.should.to.be.at.least (moment ().hour (0).minute (0));
	});

	it ('should not renew when account is not recursive', function (){
		var acc = accounts[0];
		acc.recursive.isRecursive = false;
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);
	});

	it ('should not renew when last renew is today', function (){
		var acc = accounts[0];
		acc.recursive.lastRenewDate = moment ();
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);		
	});

	it ('should not renew when maxRenewNum == renewNum', function (){
		var acc = accounts[0];
		acc.recursive.renewNum = acc.recursive.maxRenewNum;
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);			
	});

});

xdescribe ('Withdraw an account', function (){
	var account;
	beforeEach (function (){
		accounts = [
			{
				name: 'acc 1',
				price: 350000,
				amount: 3,			
			}
		]
	})

	it ('should return 0 when amount to be paid is less than or equal amount in the account', function (){
		var amount = 2.5;
		var acc = new Accounts (accounts[0]);
		var remain = acc.withdraw (amount);
		remain.should.to.equal (0);
	});

	it ('should return > 0 when amount to be paid is greater than amount in the account', function (){
		var amount = 4.5;
		var acc = new Accounts (accounts[0]);
		var remain = acc.withdraw (amount);
		remain.should.to.equal (1.5);		
	});

	it ('should ')
});