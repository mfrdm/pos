var chai = require ('chai');
var should = chai.should ();
var server = require ('../../app');
var mongoose = require ('mongoose');
var Promocodes = require ('../../app_api/models/promocodes.model');
var Orders = require ('../../app_api/models/orders');

describe ('Orders', function (){
	describe ('Get total', function (){
		var val, order;
		beforeEach (function (){
			val = {
				orderline: [
					{
						_id: '',
						productName: 'Coca',
						quantity: 2,
						price: 10000,

					},
					{
						_id: '',
						productName: 'Poca',
						quantity: 1,
						price: 10000,

					},
				]
			}
		});

		it ('should get correct subtotal and total when having no promocode', function (){
			order = new Orders (val);
			order.getSubTotal ();
			order.getTotal ();

			var expectedTotal = 30000;
			var expectedSubTotal = [20000, 10000];
			order.total.should.to.equal (expectedTotal);
			order.orderline.map (function (x, i, arr){
				x.subTotal.should.to.equal (expectedSubTotal[i]);
			});	
		});
	});
});