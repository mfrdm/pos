process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var NewPromocodes = require ('../../app_api/models/newPromocodes.model');
var NewOccupancies = require ('../../app_api/models/newOccupancies.model');
var moment = require ('moment');

describe ('Set default codes', function (){
	var occ;
	beforeEach (function (){
		occ = {
			checkinTime: moment().add (-3.5, 'hour'),
			checkoutTime: moment(),
			customer: {
				isStudent: false, // NOTICE
			},
			service: {
				name: 'Group Common',
				price: 15000
			}
		}
	});

	it ('should add student code', function (){
		occ.customer.isStudent = true;
		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();

		newOcc.promocodes.length.should.to.be.at.least (1);
		newOcc.promocodes[0].name.should.to.equal ('studentprice');
	});

	it ('should set student code even when there are codes of different types', function (){
		occ.promocodes = [
			{name: 'code 1', codeType: 1, priority: 2}
		]		
		occ.customer.isStudent = true;
		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();

		newOcc.promocodes.length.should.to.be.at.least (1);
		newOcc.promocodes[1].name.should.to.equal ('studentprice');
	});

	it ('should not set student code when customer is not student', function (){
		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(0);	
	});

	it ('should not set student code when there is a code of the same type and higher priority even if customer is a student', function (){
		occ.customer.isStudent = true;
		occ.promocodes = [
			{name: 'code 1', codeType: 2, priority: 2}
		]

		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(1);
		newOcc.promocodes[0].name.should.not.to.equal ('studentprice');
	});

	it ('should set small group private discount', function (){
		occ.service = {
			name: 'small group private',
			price: 150000,
		}

		occ.usage = 1.1;

		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(1);
		newOcc.promocodes[0].name.should.to.equal ('smallprivatediscountprice');
	})

	it ('should set medium group private discount', function (){
		occ.service = {
			name: 'medium group private',
			price: 220000,
		}

		occ.usage = 1.1;

		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(1);
		newOcc.promocodes[0].name.should.to.equal ('mediumprivatediscountprice');
	})

	it ('should set large group private discount', function (){
		occ.service = {
			name: 'large group private',
			price: 500000,
		}

		occ.usage = 1.1;

		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(1);
		newOcc.promocodes[0].name.should.to.equal ('largeprivatediscountprice');
	});

	it ('should not set small group private discount when there is a code of the same type and higher priority', function (){
		occ.service = {
			name: 'small group private',
			price: 150000,
		}

		occ.promocodes = [
			{name: 'code 1', codeType: 3, priority: 2}
		]

		occ.usage = 1.1;

		var newOcc = new NewOccupancies (occ);
		newOcc.addDefaultCodes ();
		newOcc.promocodes.length.should.to.equal(1);
		newOcc.promocodes[0].name.should.to.not.equal ('smallprivatediscountprice');
	});
});

describe ('Get total', function (){
	var occ;
	beforeEach (function (){
		occ = {
			checkinTime: moment().add (-3.5, 'hour'),
			checkoutTime: moment(),
			customer: {
				isStudent: false, // NOTICE
			},
			service: {
				name: 'Group Common',
				price: 15000
			}
		}
	});

	it ('should return correct total when no codes provided', function (){
		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();
		newOcc.total.should.to.equal (53000);
		newOcc.usage.should.to.equal (3.5);
	})

	it ('should return correct total when 1 usage code provided', function (){
		occ.promocodes = [
			{
				name: 'code 2',
				codeType: 1,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 10,
						formula: 1
					}
				}				
			}
		];

		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (0);
		newOcc.usage.should.to.equal (3.5);		
	})

	it ('should return correct total when 1 price code provided', function (){
		occ.promocodes = [
			{
				name: 'code 1',
				codeType: 2,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					price: {
						value: 10000
					}
				}					
			}
		];

		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (35000);
		newOcc.usage.should.to.equal (3.5);			
	})

	it ('should return correct total when 1 total code provided', function (){
		occ.promocodes = [
			{
				name: 'code 4',
				codeType: 3,
				services: ['Large group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 450000,
						formula: 1
					}
				}					
			}
		];

		occ.service = {
			price: 500000,
			name: 'Large group private'
		}

		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (1625000);
		newOcc.usage.should.to.equal (3.5);			
	})

	it ('should return correct total when 1 code usage and 1 code price provided', function (){
		occ.promocodes = [
			{
				name: 'code 2',
				codeType: 1,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 1,
						formula: 1
					}
				}				
			}
		];

		occ.customer.isStudent = true;
		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (25000);
		newOcc.usage.should.to.equal (3.5);
		newOcc.promocodes.length.should.to.be.at.least (2);	
	});

	it ('should return correct total when 1 code price and 1 code total provided', function (){
		occ.promocodes = [
			{
				name: 'code 3',
				codeType: 3,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					total: {
						value: 0.5,
						formula: 2
					}
				}				
			},

		];

		occ.customer.isStudent = true;
		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (18000);
		newOcc.usage.should.to.equal (3.5);
		newOcc.promocodes.length.should.to.be.at.least (2);				
	});

	it ('should return correct total when 1 code usage and 1 code total provided', function (){
		occ.promocodes = [
			{
				name: 'code 3',
				codeType: 1,
				services: ['small group private'],
				priority: 2,
				redeemData: {
					usage: {
						value: 2,
						formula: 1
					}
				}				
			},
		];

		occ.service = {
			name: 'small group private',
			price: 150000
		}

		occ.customer.isStudent = true;
		var newOcc = new NewOccupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (225000);
		newOcc.usage.should.to.equal (3.5);
		newOcc.promocodes.length.should.to.be.at.least (1);

	});
})
