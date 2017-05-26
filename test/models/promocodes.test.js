var chai = require ('chai');
var should = chai.should ()
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes');

describe ('Promotion Code', function (){

	xdescribe ('Create a promotion code', function (){
		it ('should be invalid when required input is not provided', function (){
			var pc = new Promocodes ();
			pc.validate (function (err){
				expect (err.errors.name).to.exist;
				expect (err.errors.start).to.exist;
				expect (err.errors.end).to.exist;
			});
		});		
	})

	// Later
	xdescribe ('Read promotion codes', function (){

	});

	// Later
	xdescribe ('Validate promotion code', function (){
		it ('should be invalid when redeem non-exist promotion code');
		it ('should be invalid when redeem expired promotion code');
	});

	// Later
	xdescribe ('Check code', function (){

	});

	xdescribe ('Redeem mixed', function (){
		it ('should return discount price when usage is more than 1 hour for group private service', function (){
			var prices = [220000, 150000];
			var code = 'PRIVATEDISCOUNTPRICE';
			var usage = 3.5;
			var expectedTotal = [220000 + 200000 * 2.5, 150000 + 120000 * 2.5];
			var productNames = ['Medium Group Private', 'Small Group Private'];
			productNames.map (function (x, i, arr){
				var price = prices[i];
				var total = Promocodes.redeemMixed (code, usage, price, x);
				total.should.to.equal (expectedTotal[i]);
			});
			
		});

		it ('should return discount price when usage is more than 1 hour for group private service', function (){
			var prices = [220000, 150000];
			var usage = 3.5;
			var code = 'PRIVATEDISCOUNTPRICE';
			var expectedTotal = [220000 + 200000 * 2.5, 150000 + 120000 * 2.5];
			var productNames = ['Medium Group Private', 'Small Group Private'];
			productNames.map (function (x, i, arr){
				var price = prices[i];
				var total = Promocodes.redeemMixed (code, usage, price, x);
				total.should.to.equal (expectedTotal[i]);
			});
			
		});

	});

	xdescribe ('Redeem price', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return discount price for student using common services', function (){
			var price = 15000;
			var expectedPrice = [10000, 10000];
			var productNames = ['Group Common', 'Individual Common'];
			var code = "STUDENTPRICE";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, price, x, usage);
				p.should.to.equal (expectedPrice[i]);
			});		
		});

		it ('should return original price for student using private services', function (){
			var prices = [220000, 150000];
			var expectedPrice = prices;
			var productNames = ['Medium Group Private', 'Small Group Private'];
			var code = "NONSTUDENT";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, prices[i], x, usage);
				p.should.to.equal (expectedPrice[i]);
			});		
		});

		it ('should return original price for non-student', function (){
			var price = 15000;
			var expectedPrice = [10000, 10000];
			var productNames = ['Group Common', 'Individual Common'];
			var code = "NONSTUDENT";
			productNames.map (function (x,i,arr){
				var p = Promocodes.redeemPrice (code, price, x, usage);
				p.should.to.not.equal (expectedPrice[i]);
			});		
		});

	});

	xdescribe ('Redeem total', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return original total when redeem invalid codes', function (){
			var code = 'INVALIDCODE';
			var redeemedTotal = Promocodes.redeemTotal (code, total); 
			redeemedTotal.should.to.equal (total);
		});	

		it ('should return correct total when redeem YEUGREENSPACE', function (){
			var code = 'YEUGREENSPACE';
			var redeemedTotal = Promocodes.redeemTotal (code, total);
			redeemedTotal.should.to.equal (total * 0.5);
		});

	});

	describe ('Redeem usage', function (){
		var usage, total;

		beforeEach (function (){
			usage = 3;
			total = 45000;
		});

		it ('should return original usage when redeem invalid codes', function (){
			var code = 'INVALIDCODE';
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage);
		});

		it ('should return correct usage when redeem V01H06', function (){
			var code = 'V01H06';
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 1);
		});

		it ('should return correct usage when redeem V02H06', function (){
			var code = 'V02H06';
			usage = 3.5;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (usage - 2);
		});

		it ('should return correct usage when redeem V01H06 and usage is less than 1 hour', function (){
			var code = 'V01H06';
			usage = 0.2;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);		
		})

		it ('should return correct usage when redeem V02H06 and usage is less than 1 hour', function (){
			var code = 'V02H06';
			usage = 0.1;
			var redeemedUsage = Promocodes.redeemUsage (code, usage);
			redeemedUsage.should.to.equal (0);
		});			

	});

	xdescribe ('Add default codes', function (){
		var occ;
		beforeEach (function (){
			occ = {
				service: {
					name: 'Group Common'
				},
				customer: {
					isStudent: true,
				},
				usage: 3.2,
			}
		})

		it ('should add code STUDENTPRICE if user is a student', function (){
			var pdp = 0;
			var sp = 0;
			Promocodes.addDefaultCodes (occ);
			occ.promocodes.should.to.have.property ('length');
			occ.promocodes.map (function (x, i, arr){
				if (x.name == 'privatediscountprice' && x.codeType == 4){
					pdp ++;
				}
				if (x.name == 'studentprice' && x.codeType == 2){
					sp ++;
				}
			});

			pdp.should.to.equal (0);
			sp.should.to.equal (1);	
		});

		it ('should add code PRIVATEDISCOUNTPRICE if using group private service and usage is more than 1 hour', function (){
			var pdp = 0;
			var sp = 0;
			occ.service.name = 'Medium group private';
			Promocodes.addDefaultCodes (occ);
			occ.promocodes.should.to.have.property ('length');
			occ.promocodes.map (function (x, i, arr){
				if (x.name == 'privatediscountprice' && x.codeType == 4){
					pdp ++;
				}
				if (x.name == 'studentprice' && x.codeType == 2){
					sp ++;
				}				
			});

			pdp.should.to.equal (1);
			sp.should.to.equal (0);		
		})
	});

});