process.env.NODE_ENV = "development";

var moment = require ('moment');
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var should = chai.should ();

chai.use (chaiHttp);

describe ('Check out', function (){
	var order;
	var newOrder;
	var expectedUsage;
	this.timeout(3000);

	beforeEach (function (done){
		expectedUsage = 0.3;
		order = {
			promocodes:[{
				name: 'YEUGREENSPACE',
				_id: '590c4e04b1640f33e8d4149b',
			}],
			orderline: [ 
				{ "productName" : "Common", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 }, 
				{ "productName" : "Coca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 2, price: 10000 }, 
				{ "productName" : "Poca", "_id" : new mongoose.Types.ObjectId("58ff58e6e53ef40f4dd664cd"), "quantity" : 1, price: 10000 } 
			],
			customer:{
				_id: "58ff58e6e53ef40f4dd664cd",
				firstname: 'Hiep',
				lastname: 'Pham',
				phone: '0965284281',
				email: 'hiep@yahoo.com',
			},
			storeId: "58eb474538671b4224745192",
			staffId: "58eb474538671b4224745192",
			checkoutTime: moment ().add (expectedUsage, 'hours'),			
		};

		chai.request (server)
			.post ('/checkin/' + order.customer._id)
			.send ({data: order})
			.end (function (err, res){
				if (err) {
					console.log (err);
					return
				}
				else{
					newOrder = res.body.order;
				}
				done ()
			});
	});

	afterEach (function (done){
		Orders.remove ({'_id': newOrder._id}, function (err, data){
			if (err){
				console.log (err)
				return
			}

			done ();
		});
	});

	xit ('should checkout successfully', function (done){
		chai.request (server)
			.get ('/checkout/invoice/' + newOrder._id)
			.end (function (err, res){
				if (err){
					// console.log (err)
				}

				res.should.have.status (200);
				res.body.data.should.to.exist;
				res.body.data.promocodes.should.to.exist;
				done ();
			});
	});

	xit ('should get promotion code when exist', function (done){
		chai.request (server)
			.get ('/checkout/invoice/' + newOrder._id)
			.end (function (err, res){
				if (err){
					console.log (err)
				}

				res.should.have.status (200);
				res.body.data.promocodes[0].name.should.to.exist;
				done ();
			});		
	});

	xit ('should calculate correct usage time', function (done){
		chai.request (server)
			.get ('/checkout/invoice/' + newOrder._id)
			.end (function (err, res){
				if (err){
					console.log (err)
				}

				res.should.have.status (200);
				res.body.data.should.to.exist;
				res.body.data.usage.should.to.equal (expectedUsage);
				done ();
			});		
	});

	it ('should calculate correct total without promotion', function (done){
		order.promocodes = [];
		var expectedTotal = order.orderline[0].price * expectedUsage * order.orderline[0].quantity  + order.orderline[1].price * order.orderline[1].quantity + order.orderline[2].price * order.orderline[2].quantity;
		chai.request (server)
			.post ('/checkin/' + order.customer._id)
			.send ({data: order})
			.end (function (err, res){
				if (err) {
					console.log (err);
					return
				}
				else{
					newOrder = res.body.order;
					chai.request (server)
						.get ('/checkout/invoice/' + newOrder._id)
						.end (function (err, res){
							if (err){
								console.log (err)
							}
							console.log (res.body.data)
							res.should.have.status (200);
							res.body.data.should.to.exist;
							res.body.data.usage.should.to.equal (expectedUsage);
							// res.body.data.total.should.to.equal (expectedTotal);

							done ();
						});	
				}
			});				
	});	

	it ('should update order')
	it ('should be invalid when not found required input')

});