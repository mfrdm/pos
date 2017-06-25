process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes.model');
var Occupancies = require ('../../app_api/models/occupancies.model');
var moment = require ('moment');

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
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();
		newOcc.total.should.to.equal (53000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (15000);
	})

	it ('should return correct total when 1 usage code provided', function (){
		occ.promocodes = [
			{
				name: 'code 2',
				codeType: 1,
				services: ['group common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 10,
						formula: 1
					}
				}				
			}
		];

		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (0);
		newOcc.oriUsage.should.to.equal (3.5);	
		newOcc.usage.should.to.equal (0);
		newOcc.price.should.to.equal (15000);
	})

	it ('should return correct total when 1 price code provided', function (){
		occ.promocodes = [
			{
				name: 'code 1',
				codeType: 2,
				services: ['group common'],
				priority: 2,
				redeemData: {
					price: {
						value: 10000
					}
				}					
			}
		];

		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (35000);
		newOcc.oriUsage.should.to.equal (3.5);	
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (10000);				
	})

	it ('should return correct total when 1 total code provided', function (){
		occ.promocodes = [
			{
				name: 'code 4',
				codeType: 3,
				services: ['large group private'],
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

		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (1625000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (500000);				
	})

	it ('should return correct total when 1 code usage and 1 code price provided', function (){
		occ.promocodes = [
			{
				name: 'code 2',
				codeType: 1,
				services: ['group common'],
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
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (25000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (2.5);
		newOcc.price.should.to.equal (10000);	
		newOcc.promocodes.length.should.to.be.at.least (2);	

	});

	it ('should return correct total when 1 code price and 1 code total provided', function (){
		occ.promocodes = [
			{
				name: 'code 3',
				codeType: 3,
				services: ['group common'],
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
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (18000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (10000);	
		newOcc.promocodes.length.should.to.be.at.least (2);				
	});

	it ('should return correct total when 1 code price, 1 code total provided, and service is private', function (){
		occ.promocodes = [
			{
				name: 'code 3',
				codeType: 2,
				services: ['medium group private'],
				priority: 2,
				redeemData: {
					price: {
						value: 150000,
					}
				}				
			},

		];

		occ.service = {
			name: 'Medium group private',
			price: 220000
		}

		occ.customer.isStudent = true;
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (150000 * 3.5);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (150000);	
		newOcc.promocodes.length.should.to.be.at.least (1);				
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
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (225000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (1.5);
		newOcc.price.should.to.equal (150000);	
		newOcc.promocodes.length.should.to.be.at.least (1);
	});

	it ('should return correct total when 2 total code with different priority provided', function (){
		occ.promocodes = [
			{
				name: 'code 3',
				codeType: 3,
				services: ['small group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 0.5,
						formula: 2
					}
				}				
			},
		];

		occ.service = {
			name: 'small group private',
			price: 150000
		}

		occ.customer.isStudent = true;
		var newOcc = new Occupancies (occ);
		newOcc.getTotal ();

		newOcc.total.should.to.equal (263000);
		newOcc.oriUsage.should.to.equal (3.5);
		newOcc.usage.should.to.equal (3.5);
		newOcc.price.should.to.equal (150000);
		newOcc.promocodes.length.should.to.be.at.least (1);		
	});

});

xdescribe ('Get usage', function (){

	it ('should return usage of 0 if it is less than 6 min', function (){
		var occ = {
			checkinTime: moment ().add (-2, 'minute'),
			checkoutTime: moment ()
		}

		var newOcc = new Occupancies (occ);

		newOcc.getUsageTime ().should.to.equal (0);

	});

	it ('should return usage of 1 if it is at least 6 min and no more than 1 hour', function (){
		var occ = [
			{
				checkinTime: moment ().add (-6, 'minute'),
				checkoutTime: moment ()
			},
			{
				checkinTime: moment ().add (-11, 'minute'),
				checkoutTime: moment ()
			},			
		];

		occ.map (function (x, i, arr){
			var newOcc = new Occupancies (x);
			var usage = newOcc.getUsageTime ();
			usage.should.to.be.equal (1);
		});

	});

	// Remove later
	xit ('show usage with decimal number', function (){
		var occ = [
			{
				checkinTime: moment ().add (-67, 'minute'),
				checkoutTime: moment ()
			},
			{
				checkinTime: moment ().add (-68, 'minute'),
				checkoutTime: moment ()
			},			
		];

		occ.map (function (x, i, arr){
			var newOcc = new Occupancies (x);
			var usage = newOcc.getUsageTime ();
			usage.should.to.be.above (1);
			usage.should.to.be.below (1.2);
		});		
	});


});
