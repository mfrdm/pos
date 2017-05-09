process.env.NODE_ENV = "development";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Combos = mongoose.model ('combos');
var ComboOrders = mongoose.model ('combosOrders');
var should = chai.should ();

describe ('Combos', function (){
	describe ('Create a combo');
	describe ('Read a combo');
	describe ('Read combos');
	describe ('Update a combo');

	describe ('Purchase a combo', function (){
		beforeEach (function (done){
			var combos = [
				{
					orderline: [
						{ // combo
							quantity: 2,
							value: 'oneDay', // combo value
							_id: "590ea053c8e1de00c93ab3fd",
							expired: new Date ('2017-05-10'),
						},
					],
					product: {
						_id: "590ea267c8e1de00c93ab402",
						name: 'group common',
					},
					customerId: mongoose.Schema.Types.ObjectId,
					total: 100000,			
				}
			];
		})

		it ('should create a combo order', function (done){
			chai.request (server)
				.post ('/combos/buy')
				.send (data: combos)
				.end (function (err, res){
					res.should.have.status (200);
					// STOP HERE
				});
		});

		xit ('should add combo to customer and comboOrders');

		xit ('should cumulate combo remain for the same product');

		xit ('should ignore remain of current combo if it was expire');

	});


});