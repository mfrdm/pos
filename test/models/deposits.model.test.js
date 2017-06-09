process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var NewPromocodes = require ('../../app_api/models/newPromocodes.model');
var Deposits = require ('../../app_api/models/deposit.model');
var moment = require ('moment');

describe ('Get total', function (){
	var deposit;
	beforeEach (function (){
		deposit = {
			quantity: 1,
			account: {
				name: 'Combo 1 ngày common',
				price: 79000,
				services: ['group common', 'individual common']
			},
			customer: {
				isStudent: false
			}
		}
	});

	it ('should return correct total when having no promocode', function (){
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (79000);
	});

	it ('should return correct total when having student-combo-common-1-day code', function (){
		deposit.customer.isStudent = true;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (59000);			
	})

	it ('should return correct total when having student-3-combo-common-1-day code', function (){
		deposit.quantity = 3;
		deposit.customer.isStudent = true;

		var newPrice = 49000;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (newPrice * deposit.quantity);			
	})

	it ('should return correct total when having student-5-combo-common-1-day code', function (){
		deposit.quantity = 6;
		deposit.customer.isStudent = true;

		var newPrice = 39000;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (newPrice * deposit.quantity);	
	});

	it ('should return correct total when having 3-combo-common-1-day code', function (){
		deposit.quantity = 4;

		var newPrice = 69000;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (newPrice * deposit.quantity);
	});

	it ('should return correct total when having 5-combo-common-1-day code', function (){
		deposit.quantity = 5;

		var newPrice = 59000;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (newPrice * deposit.quantity);

	});
});


