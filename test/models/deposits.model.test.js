process.env.NODE_ENV = 'test';
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes.model');
var Deposits = require ('../../app_api/models/deposit.model');
var moment = require ('moment');

describe ('Get total', function (){
	var deposit;
	beforeEach (function (){
		deposit = {
			quantity: 1,
			groupon: {},
			account: {
				name: '1dCommon',
				price: 79000,
				services: ['group common', 'individual common']
			},
			customer: {
				isStudent: false
			}
		}
	});

	xit ('should return correct total when having no promocode', function (){
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.total.should.to.equal (79000);
	});

	xit ('should return correct total when having 1-day-common-for-student code', function (){
		deposit.customer.isStudent = true;
		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('student_common1d');	
		newDeposit.total.should.to.equal (59000);				
	})

	it ('should return correct total when having 3-day-common-for-student code', function (){
		deposit.account.name = '3dCommon';
		deposit.account.price = 190000;
		deposit.customer.isStudent = true;

		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();

		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('student_common3d');			
		newDeposit.total.should.to.equal (150000);			
	})

	it ('should return correct total when having group-3-1-day-common-for-student code', function (){
		deposit.customer.isStudent = true;
		deposit.groupon = {quantity: 4};

		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('student_group3_common1d');	
		newDeposit.total.should.to.equal (49000);	
	});

	it ('should return correct total when having group-5-1-day-common-for-student code', function (){
		deposit.customer.isStudent = true;
		deposit.groupon = {quantity: 6};

		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('student_group5_common1d');	
		newDeposit.total.should.to.equal (39000);	
	});

	it ('should return correct total when having group-3-1-day-common code', function (){
		deposit.groupon = {quantity: 4};

		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('group3_common1d');	
		newDeposit.total.should.to.equal (69000);	
	});

	it ('should return correct total when having group-5-1-day-common code', function (){
		deposit.groupon = {quantity: 7};

		var newDeposit = new Deposits (deposit);
		newDeposit.getTotal ();
		newDeposit.promocodes.should.to.have.lengthOf (1);
		newDeposit.promocodes[0].name.should.to.equal ('group5_common1d');	
		newDeposit.total.should.to.equal (59000);	
	});

});


