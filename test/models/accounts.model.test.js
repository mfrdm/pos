process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Accounts = require ('../../app_api/models/accounts.model');
var Promocodes = require ('../../app_api/models/promocodes.model');
var Occupancies = require ('../../app_api/models/occupancies.model');
var moment = require ('moment');

describe ('Renew a daily recursive account', function (){
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
	});

	it ('should renew an account when it is a recursive and last review is not today,  maxRenewNum > renewNum, and amount is 0', function (){
		var acc = accounts[0];
		var now = moment ();
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.equal (newAcc.recursive.baseAmount);
		moment (newAcc.recursive.lastRenewDate).isSameOrAfter (now).should.to.equal (true) ;
	});

	it ('should renew an account when it is a recursive and last review is not today,  maxRenewNum > renewNum, and amount is not 0', function (){
		var acc = accounts[0];
		var now = moment ();
		acc.amount = 2;
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.equal (newAcc.recursive.baseAmount);
		moment (newAcc.recursive.lastRenewDate).isSameOrAfter (now).should.to.equal (true) ;
	});

	it ('should not renew when account is not recursive', function (){
		var acc = accounts[0];
		var now = new Date ();
		acc.recursive.isRecursive = false;
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);
		moment (newAcc.recursive.lastRenewDate).isBefore (now).should.to.equal (true) ;
	});

	it ('should not renew when last renew is today', function (){
		var acc = accounts[0];
		var today = moment ().hour (0).minute (0);
		acc.recursive.lastRenewDate = moment ();
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);
		moment (newAcc.recursive.lastRenewDate).isSameOrAfter (today).should.to.equal (true) ;

	});

	it ('should not renew when maxRenewNum == renewNum', function (){
		var acc = accounts[0];
		var now = moment ();
		acc.recursive.renewNum = acc.recursive.maxRenewNum;
		var newAcc = new Accounts (acc);
		newAcc.renew ();

		newAcc.amount.should.to.not.equal (newAcc.recursive.baseAmount);
		moment (newAcc.recursive.lastRenewDate).isBefore (now).should.to.equal (true) ;			
	});

});

describe ('Withdraw an account', function (){
	var account, occ, occContext;
	beforeEach (function (){
		occ = {
			checkinTime: moment ().add (-3, 'hour'),
			checkoutTime: moment (),
			service: {name: 'Group common'},
			price: 15000,
			total: 45000
		}

		occ = new Occupancies (occ);
		context = occ.getAccContext ();

		accounts = [
			{
				name: 'acc 1',
				amount: 4,
				unit: 'hour'		
			},
			{
				name: 'acc 2',
				amount: 1,
				unit: 'hour'		
			},			
			{
				name: 'acc 3',
				amount: 50000,
				unit: 'vnd'		
			},
			{
				name: 'acc 4',
				amount: 40000,
				unit: 'vnd'		
			},					
		];
	});

	it ('should return amount = 0 when amount to be paid is less than or equal amount in the hour account', function (){
		var acc = new Accounts (accounts[0]);
		acc.withdraw (context);
		occ.usage.should.to.equal (0);
		acc.amount.should.to.equal (1);
	});

	it ('should retunn amount > 0 when amount to be paid is greater than amount in the hour account', function (){
		var acc = new Accounts (accounts[1]);
		acc.withdraw (context);
		occ.usage.should.to.equal (2);
		acc.amount.should.to.equal (0);	
	});

	it ('should retunn amount = 0 when amount to be paid is greater than amount in the cash account', function (){
		var acc = new Accounts (accounts[2]);
		acc.withdraw (context);
		occ.total.should.to.equal (0);
		acc.amount.should.to.equal (5000);	
	});

	it ('should retunn amount > 0 when amount to be paid is greater than amount in the cash account', function (){
		var acc = new Accounts (accounts[3]);
		acc.withdraw (context);
		occ.total.should.to.equal (5000);
		acc.amount.should.to.equal (0);	
	});

});