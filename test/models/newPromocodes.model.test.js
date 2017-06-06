process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var NewPromocodes = require ('../../app_api/models/newPromocodes.model');

describe ('redeem', function (){
	var codes;
	beforeEach (function (){
		codes = [
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
			},		
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
			},
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
			},								
		]
	});

	it ('should redeem price', function (){
		var result = new NewPromocodes (codes[0]).redeem ();
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('usage');

	})

	it ('should redeem usage', function (){
		var usage = 5;
		var result = new NewPromocodes(codes[1]).redeem (null, usage);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
	})

	it ('should redeem total', function (){
		var price = 500000;
		var usage = 2;
		expectedTotal = 950000;
		var result = new NewPromocodes (codes[2]).redeemTotal (price, usage);

		result.total.should.to.equal (expectedTotal);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');	
	})

});

describe ('Redeem total', function (){
	var codes;
	beforeEach (function (){
		codes = [
			{
				name: 'code 1',
				codeType: 3,
				services: ['Small group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 1000000
					}
				}				
			},
			{
				name: 'code 2',
				codeType: 3,
				services: ['Small group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 120000,
						formula: 1
					}
				}				
			},
			{
				name: 'code 3',
				codeType: 3,
				services: ['Medium group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 200000,
						formula: 1
					}
				}				
			},
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
			},
			{
				name: 'code 5',
				codeType: 3,
				services: ['all'],
				priority: 2,
				redeemData: {
					total: {
						value: 0.5,
						formula: 2
					}
				}				
			},										

		]
	});

	it ('should return a fix total when fix-total code is used', function (){
		var result = new NewPromocodes (codes[0]).redeemTotal ();
		result.total.should.to.equal (1000000);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');			
	})

	it ('should return a expected total when formula 1 is used and usage > 1', function (){
		var usage = 2;
		var price = [150000, 220000, 500000];
		var expectedTotal = [270000, 420000, 950000]

		codes = codes.slice (1, 4);

		codes.map (function (x, i, arr){
			var result = new NewPromocodes (x).redeemTotal (price[i], usage);

			result.total.should.to.equal (expectedTotal[i]);
			result.should.not.to.have.property ('usage');
			result.should.not.to.have.property ('price');	
		});
	})

	it ('should return a expected total when formula 1 is used and usage <= 1', function (){
		var usage = 1;
		var price = [150000, 220000, 500000];
		var expectedTotal = [150000, 220000, 500000]

		codes = codes.slice (1, 4);

		codes.map (function (x, i, arr){
			var result = new NewPromocodes (x).redeemTotal (price[i], usage);

			result.total.should.to.equal (expectedTotal[i]);
			result.should.not.to.have.property ('usage');
			result.should.not.to.have.property ('price');	
		});		
	});

	it ('should return expected total when formula 2 is used', function (){
		var usage = 2;
		var price = 15000;
		var result = new NewPromocodes (codes[4]).redeemTotal (price, usage);

		result.total.should.to.equal (15000);
	})
});

describe ('Redeem usage', function (){
	var codes;
	beforeEach (function (){
		codes = [
			{
				name: 'code 1',
				codeType: 1,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 0
					}
				}				
			},
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
			},
			{
				name: 'code 3',
				codeType: 1,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 2,
						formula: 1
					}
				}				
			},					

		]
	});	


	it ('should return a new usage when applying new-usage code', function (){
		var result = new NewPromocodes (codes[0]).redeemUsage ();
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');		
	});

	it ('should return a substracted usage when applying substract-usage code and service usage is less than or equal redeem usage', function (){
		var usage = 5;
		var result = new NewPromocodes(codes[1]).redeemUsage (usage);
		
		result.usage.should.to.equal (0);

		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');			
	})

	it ('should return a substracted usage when applying substract-usage code and service usage is greater than redeem usage', function (){
		var usage = 5;
		var result = new NewPromocodes(codes[2]).redeemUsage (usage);
		
		result.usage.should.to.equal (3);

		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');			
	})
});

describe ('Redeem price', function (){
	var codes;
	beforeEach (function (){
		codes = [
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
			},
			{
				name: 'code 2',
				codeType: 2,
				services: ['Group common'],
				priority: 2,
				redeemData: {
					price: {
						value: 0.9,
						formula: 1
					}
				}				
			},			

		]
	});

	it ('should return a expected price when applying code having no formula', function (){
		var result = new NewPromocodes(codes[0]).redeemPrice ();
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('usage');
	});

	it ('should return a expected price when applying code having formula of percentage', function (){
		var price = 10000;
		var result = new NewPromocodes(codes[1]).redeemPrice (price);
		
		result.price.should.to.equal (9000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('usage');
	});
});