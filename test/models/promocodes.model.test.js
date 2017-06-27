process.env.NODE_ENV = 'test';	
var chai = require ('chai');
var should = chai.should ();
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes.model');
var Occupancies = require ('../../app_api/models/occupancies.model');
var Deposits = require ('../../app_api/models/deposit.model')

xdescribe ('redeem', function (){
	var codes, context;
	beforeEach (function (){
		context = {
			productName: 'service',
			price: 15000,
			usage: 5,
			total: null,
			getService: function (){ return 'group common'},
			getUsage: function (){ return this.usage },
			getPrice: function (){return this.price},
			getTotal: function (){return this.total},
			getPromocodes: function (){ return occ.promocodes },
			setPromocodes: function (codes){ occ.promocodes = codes },
			isStudent: function (){ return occ.customer.isStudent }
		};

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
			}								
		]
	});

	it ('should redeem price', function (){
		var result = new Promocodes (codes[0]).redeem (context);
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('usage');

	})

	it ('should redeem usage', function (){
		var result = new Promocodes (codes[1]).redeem (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');
	})

	it ('should redeem total', function (){
		context.price = 500000;
		context.getService = function (){ return 'large group private'}
		context.usage = 2;

		var expectedTotal = 950000;

		var result = new Promocodes (codes[2]).redeem (context);
		result.total.should.to.equal (expectedTotal);
		result.should.not.to.have.property ('usage ');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');
	});

});

xdescribe ('Redeem price', function (){
	var codes, context;
	beforeEach (function (){
		context = {
			productName: 'service',
			price: 15000,
			usage: 5,
			total: null,
			getService: function (){ return 'group common'},
			getUsage: function (){ return this.usage },
			getPrice: function (){return this.price},
			getTotal: function (){return this.total},
			getPromocodes: function (){ return occ.promocodes },
			setPromocodes: function (codes){ occ.promocodes = codes },
			isStudent: function (){ return occ.customer.isStudent }
		};

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
		var result = new Promocodes (codes[0]).redeemPrice (context);
		result.price.should.to.equal (10000);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('usage');

	});

	it ('should return correct price when a group of 5 customers buy 1-day-common combo');

	it ('should return correct price when a customer buy 3 1-day-common combo for student');
});

xdescribe ('Redeem quantity', function (){
});

xdescribe ('Redeem usage', function (){
	var codes, context;
	beforeEach (function (){
		context = {
			productName: 'service',
			price: 15000,
			usage: 2,
			total: null,
			getService: function (){ return 'group common'},
			getUsage: function (){ return this.usage },
			getPrice: function (){return this.price},
			getTotal: function (){return this.total},
			getPromocodes: function (){ return occ.promocodes },
			setPromocodes: function (codes){ occ.promocodes = codes },
			isStudent: function (){ return occ.customer.isStudent }
		};

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

		var result = new Promocodes (codes[0]).redeemUsage (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');

	})

	it ('should return a substracted quantity when applying substract-quantity code and service usage is LESS THAN OR EQUAL redeem usage', function (){

		var result = new Promocodes (codes[1]).redeemUsage (context);
		result.usage.should.to.equal (0);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');			
	})

	it ('should return a substracted quantity when applying substract-quantity code and service usage is GREATER than redeem usage', function (){
		context.usage = 5;

		var result = new Promocodes (codes[2]).redeemUsage (context);
		result.usage.should.to.equal (3);
		result.should.not.to.have.property ('total');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');				
	})
});

describe ('Redeem total', function (){
	var codes, context;
	beforeEach (function (){
		context = {
			productName: 'service',
			price: 150000,
			usage: 2,
			total: null,
			getService: function (){ return 'small group private'},
			getUsage: function (){ return this.usage },
			getPrice: function (){return this.price},
			getTotal: function (){return this.total},
			getPromocodes: function (){ return occ.promocodes },
			setPromocodes: function (codes){ occ.promocodes = codes },
			isStudent: function (){ return occ.customer.isStudent }
		};

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
			{
				name: 'code 6',
				codeType: 3,
				services: ['medium group private'],
				priority: 2,
				redeemData: {
					total: {
						formula: 3
					},
					price: {
						value: 150000
					},
					usage: {
						min: 5
					}
				}					
			},
			{
				name: 'code 7',
				codeType: 3,
				services: ['large group private'],
				priority: 2,
				redeemData: {
					total: {
						formula: 4
					},
					price: {
						value: 220000
					},
					usage: {
						max: 6
					}
				}					
			},			
		]
	});

	it ('should return a fix total when fix-total code is used', function (){
		var result = new Promocodes (codes[0]).redeemTotal (context);

		result.total.should.to.equal (75000);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');						
	})

	it ('should return a expected total when formula 1 is used and usage > 1', function (){

		var expectedTotal = 270000;

		var result = new Promocodes (codes[1]).redeemTotal (context);

		result.total.should.to.equal (expectedTotal);
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('usage');
	})

	it ('should return a expected total when formula 1 is used and usage <= 1', function (){
		context.usage = 1;						

		var expectedTotal = 150000;

		var result = new Promocodes (codes[1]).redeemTotal (context);

		result.total.should.to.equal (expectedTotal);
		result.should.not.to.have.property ('quantity');
		result.should.not.to.have.property ('price');	
		result.should.not.to.have.property ('usage');		
	});

	it ('should return expected total when formula 2 is used', function (){

		var result = new Promocodes (codes[4]).redeemTotal (context);

		result.total.should.to.equal (150000);
		result.should.not.to.have.property ('usage');
		result.should.not.to.have.property ('price');
		result.should.not.to.have.property ('quantity');
	});

	it ('should return expected total when formula 3 is used', function (){
		var result = new Promocodes (codes[5]).redeemTotal (context);

		result.total.should.to.equal (150000 * 5);

		result.should.not.to.have.property ('usage');
		result.should.to.have.property ('price');
		result.should.not.to.have.property ('quantity');

		result.price.should.to.equal (150000);		
	});

	it ('should return expected total when formula 4 is used', function (){
		var result = new Promocodes (codes[6]).redeemTotal (context);

		result.total.should.to.equal (0);

		result.should.not.to.have.property ('usage');
		result.should.to.have.property ('price');
		result.should.not.to.have.property ('quantity');

		result.price.should.to.equal (0);		
	});	

	it ('should return expected total when formula 4 is used', function (){
		context.usage = 10;
		var result = new Promocodes (codes[6]).redeemTotal (context);

		result.total.should.to.equal (220000 * 4);

		result.should.not.to.have.property ('usage');
		result.should.to.have.property ('price');
		result.should.not.to.have.property ('quantity');

		result.price.should.to.equal (220000);		
	});

});

xdescribe ('Add account default code', function (){
	var context, deposit;
	beforeEach (function (){
		deposit = [
			{
				account: {name: '1dCommon'},
				customer: {isStudent: true}
			},
			{
				account: {name: '1dCommon'},
				customer: {isStudent: false}
			},
			{
				account: {name: '3dCommon'},
				customer: {isStudent: true}
			},
			{
				account: {name: '1dCommon'},
				groupon: {quantity: 4},
				customer: {isStudent: true}
			},	
			{
				account: {name: '1dCommon'},
				groupon: {quantity: 5},
				customer: {isStudent: true}
			},	
			{
				account: {name: '1dCommon'},
				groupon: {quantity: 4},
				customer: {isStudent: false}
			},	
			{
				account: {name: '1dCommon'},
				groupon: {quantity: 5},
				customer: {isStudent: false}
			},										
		]

	});

	it ('should not add code when a non-student deposits 1 day combo', function (){
		deposit = new Deposits (deposit[1]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (0);
	})

	it ('should add a default code when a student deposits 1 day commbo', function (){
		deposit = new Deposits (deposit[0]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('student_common1d');
		});

	});

	it ('should add a default code when a student deposits 3 day commbo', function (){
		deposit = new Deposits (deposit[2]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('student_common3d');
		});
	});

	it ('should add default code when a group of 3 students deposit 1 day commbo', function (){
		deposit = new Deposits (deposit[3]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('student_group3_common1d');
		});
	})

	it ('should add default code when a group of 5 students deposit 1 day commbo', function (){
		deposit = new Deposits (deposit[4]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('student_group5_common1d');
		});		
	})

	it ('should add default code when a group of 3 deposit 1 day commbo', function (){
		deposit = new Deposits (deposit[5]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('group3_common1d');
		});			
	})

	it ('should add default code when a group of 5 deposit 1 day commbo', function (){
		deposit = new Deposits (deposit[6]);
		context = deposit.getContext ();

		Promocodes.addDefaultCodes (context);

		var promocodes = context.getPromocodes ();
		promocodes.should.have.lengthOf (1);

		promocodes.map (function (x, i, arr){
			x.name.should.to.equal ('group5_common1d');
		});			
	})

})

xdescribe ('Add service default code')

xdescribe ('Resolve code conflicts')
