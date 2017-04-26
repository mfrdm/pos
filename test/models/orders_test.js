var expect = require ('chai').expect;

var Orders = require ('../../app_api/models/orders');

describe ('Orders', function (){
	it ('should be invalid if orderline is empty', function (done){
		var order = new Orders ();

		order.validate (function (err){
			expect (err.errors.orderline).to.exist;
			done ();
		})
	});

	it ('should be invalid if customer is empty')
	it ('should be invalid if updatedAt is empty when being updated')
});