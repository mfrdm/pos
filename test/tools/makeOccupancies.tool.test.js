process.env.NODE_ENV = "test";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('Promocodes');
var Occupancy = mongoose.model ('Occupancies');
var Accounts = mongoose.model ('Accounts');
var fastcsv = require ('fast-csv')

var Maker = require ('../../tools/makeOccupancies.tool.js')

var should = chai.should ();

chai.use (chaiHttp);

xdescribe ('Prepare', function (){
	describe ('Add codes', function (){
		var data;
		beforeEach (function (){
			data = [
				{promocode: 'FSC_02H_052017', customer: {isStudent: true}},
				{promocode: 'MARKETING_01h_052017', customer: {isStudent: false}},
			]
		})

		it ('should add code when code name found', function (){
			result = Maker.addCode (data)

			result[0].promocodes.should.have.lengthOf (2);
			result[0].promocodes[0].name.should.to.equal ('FSC_02H_052017')
			result[0].promocodes[1].name.should.to.equal ('studentprice')

			result[1].promocodes.should.have.lengthOf (1);
			result[1].promocodes[0].name.should.to.equal ('MARKETING_01h_052017')
		})
	})
});

describe ('Insert occupancies', function (){
	var customers, newCustomers, occ, newOcc;
	beforeEach (function (done){
		customers = [
				{
					firstname: 'a',
					middlename: 'b',
					lastname: 'c',
					birthday: '1989-09-25',
					phone: '0965999999',
					edu: {},
					email: 'abc@gmail.com',
					isStudent: false,
					checkinStatus: false,
				},
				{
					firstname: 'x',
					middlename: 'y',
					lastname: 'z',
					birthday: '1988-09-25',
					phone: '0965999998',
					edu: {},
					email: 'xyz@gmail.com',
					isStudent: true,
					checkinStatus: false,
				},			
		];

		occ = [
			{
				service: {
					price: 15000,
					name: 'Group Common'
				},
				promocodes: [],
				customer: {},
				checkinTime: moment ().add (-0.3, 'hours'),	
				checkoutTime: moment (),	
			},		
			{
				service: {
					price: 15000,
					name: 'Individual Common'
				},
				promocodes: [],
				customer: {},
				checkinTime: moment ().add (-0.3, 'hours'),	
				checkoutTime: moment (),	
			},	
		]

		Customers.insertMany (customers, function (err, result){
			if (err){
				console.log (err);
				return
			}

			newCustomers = result;

			occ[0].customer = newCustomers[0];
			occ[1].customer = newCustomers[1];

			done ()
		});

	})

	afterEach (function (done){
		cusIds = newCustomers.map (function (x, i, arr){
			return x._id;
		});

		occIds = newOcc.map (function (x, i, arr){
			return x._id;
		});

		Customers.remove ({_id: {$in: cusIds}}, function (err, result){
			if (err){
				console.log (err);
				return;
			}

			Occupancy.remove ({_id: {$in: occIds}}, function (err, result){
				if (err){
					console.log (err);
					return;
				}

				done ();

			});

		});
	});

	it ('should insert some occupancies into database', function (done){
		chai.request (server)
			.post ('/checkout/all')
			.send ({data: occ})
			.end (function (err, res){
				if (err){
					console.log (err)
				}

				res.should.to.have.status (200);
				res.body.data.message.should.to.equal ('success')

				cusIds = newCustomers.map (function (x, i, arr){
					return x._id;
				});				

				Customers.find ({_id: {$in: cusIds}}, function (err, cus){
					if (err){
						console.log (err)
					}

					var occIds = [];

					cus.map (function (x, i, arr){
						x.occupancy.length.should.to.equal (1);
						occIds.push (x.occupancy[0]);
					});

					Occupancy.find ({_id: {$in: occIds}}, function (err, occ){
						if (err){
							console.log (err)
						}

						newOcc = occ;
						newOcc.length.should.to.equal (2);
						newOcc.map (function (x, i, arr){
							cusIds.should.to.include (x.customer._id);
						})

						done ();

					})

				})

				
			})
	});
})