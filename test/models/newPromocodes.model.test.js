process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var NewPromocodes = require ('../../app_api/models/newPromocodes.model');
var NewOccupancies = require ('../../app_api/models/newOccupancies.model');

xdescribe ('redeem', function (){
	var codes;
	beforeEach (function (){
		codes = [
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
			},		
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
			},
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
			},								
		]
	});

	it ('should redeem price', function (){
		var context = {
			service: {
				name: 'Group common',
				price: 15000,
			}
		}

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[0]).redeem (context);
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('usage');

	})

	it ('should redeem usage', function (){
		var context = {
			service: {
				name: 'Group common',
				price: 15000,
			},
			usage: 5,
		}

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[1]).redeem (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');
	})

	it ('should redeem total', function (){
		var context = {
			service: {
				name: 'Large group private',
				price: 500000,
			},
			usage: 2,
		}

		context = new NewOccupancies (context);
		var expectedTotal = 950000;

		var result = new NewPromocodes (codes[2]).redeem (context);
		result.total.should.to.equal (expectedTotal);
		result.should.not.to.have.property ('usage ');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');
	})
});

xdescribe ('Redeem price', function (){
	var codes;
	beforeEach (function (){
		codes = [
			{
				name: 'code 1',
				codeType: 2,
				services: ['group common', 'individual common'],
				priority: 2,
				redeemData: {
					price: {
						value: 10000
					}
				}				
			}
		]
	});

	it ('should return correct price when a customer is a student', function (){
		var context = {
			service: {
				name: 'Group common',
				price: 15000,
			}
		}

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[0]).redeemPrice (context);
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('usage');

	});

	it ('should return correct price when a group of 5 customers buy 1-day-common combo');

	it ('should return correct price when a customer buy 3 1-day-common combo for student', function (){	
	});
});

xdescribe ('Redeem quantity', function (){
});

xdescribe ('Redeem usage', function (){
	var codes;
	beforeEach (function (){
		codes = [
			{
				name: 'code 1',
				codeType: 1,
				services: ['group common', 'individual common'],
				priority: 2,
				redeemData: {
					usage: {
						value: 0,
					}
				}				
			},
			{
				name: 'code 2',
				codeType: 1,
				services: ['group common', 'individual common'],
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
				services: ['group common'],
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

	it ('should return correct usage when apply new-usage code', function (){
		var context = {
			service: {
				name: 'group common',
				price: 15000
			},
			usage: 2,
		};

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[0]).redeemUsage (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');

	})

	it ('should return a substracted quantity when applying substract-quantity code and service usage is LESS THAN OR EQUAL redeem usage', function (){
		var context = {
			service: {
				name: 'group common',
				price: 15000
			},
			usage: 2,
		};

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[1]).redeemUsage (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');			
	})

	it ('should return a substracted quantity when applying substract-quantity code and service usage is GREATER than redeem usage', function (){
		var context = {
			service: {
				name: 'group common',
				price: 15000
			},
			usage: 5,
		};

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[2]).redeemUsage (context);
		result.usage.should.to.equal (3);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');				
	})
});

xdescribe ('Redeem total', function (){
	var codes;
	beforeEach (function (){
		codes = [
			{
				name: 'code 1',
				codeType: 3,
				services: ['small group private'],
				priority: 2,
				redeemData: {
					total: {
						value: 75000
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
		var context = {
			service: {
				name: 'small group private',
				price: 150000
			},
			usage: 2
		}

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[0]).redeemTotal (context);

		result.total.should.to.equal (75000);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');						
	})

	it ('should return a expected total when formula 1 is used and usage > 1', function (){
		var contexts = [
			{
				service: {
					name: 'Small group private',
					price: 150000
				},
				usage: 2
			},
			{
				service: {
					name: 'Medium group private',
					price: 220000
				},
				usage: 2
			},
			{
				service: {
					name: 'Large group private',
					price: 500000
				},
				usage: 2
			}
		];						

		var newContexts = contexts.map (function (x, i, arr){
			return new NewOccupancies (x);
		});

		var expectedTotal = [270000, 420000, 950000]

		codes = codes.slice (1, 4);

		codes.map (function (x, i, arr){
			var result = new NewPromocodes (x).redeemTotal (newContexts[i]);

			result.total.should.to.equal (expectedTotal[i]);
			result.should.not.to.have.property ('quantity');
			result.should.not.to.have.property ('price');
			result.should.not.to.have.property ('usage');
		});
	})

	it ('should return a expected total when formula 1 is used and usage <= 1', function (){
		var contexts = [
			{
				service: {
					name: 'Small group private',
					price: 150000
				},
				usage: 1
			},
			{
				service: {
					name: 'Medium group private',
					price: 220000
				},
				usage: 1
			},
			{
				service: {
					name: 'Large group private',
					price: 500000
				},
				usage: 1
			}
		];						

		var newContexts = contexts.map (function (x, i, arr){
			return new NewOccupancies (x);
		});
		var expectedTotal = [150000, 220000, 500000]

		codes = codes.slice (1, 4);

		codes.map (function (x, i, arr){
			var result = new NewPromocodes (x).redeemTotal (newContexts[i]);

			result.total.should.to.equal (expectedTotal[i]);
			result.should.not.to.have.property ('quantity');
			result.should.not.to.have.property ('price');	
			result.should.not.to.have.property ('usage');
		});		
	});

	it ('should return expected total when formula 2 is used', function (){
		var context = {
			service: {
				name: 'small group private',
				price: 150000
			},
			usage: 2
		}

		context = new NewOccupancies (context);

		var result = new NewPromocodes (codes[4]).redeemTotal (context);

		result.total.should.to.equal (150000);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');
	})
});

describe ('Add account default code')

describe ('Add service default code')

describe ('Resolve code conflicts')
