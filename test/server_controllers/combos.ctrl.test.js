process.env.NODE_ENV = "development";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Combos = mongoose.model ('combos');
var should = chai.should ();

describe ('Combos', function (){
	describe ('Create a combo');
	describe ('Read a combo');
	describe ('Read combos');
	describe ('Update a combo');

	describe ('Purchase a combo', function (){
		var combos = [
			{
				_id: "590da76bd25f4b22908ce229",
				quantity: 10,
				value: "oneDay",
				product: {
					_id: "590dbd576061c5363faadfd6",
					name: "Group Common",
				},
				expired: new Date ('2017-05-10'),				
			}
		];

		it ('should add combo to customer and comboOrders', function(done){

		});

		it ('should cumulate combo remain for the same product');

		it ('should ignore remain of current combo if it was expire')

	});


});