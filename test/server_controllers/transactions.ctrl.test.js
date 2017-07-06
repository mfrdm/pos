process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var mongoose = require('mongoose');
var Transactions = mongoose.model('transactions');
var Orders = mongoose.model('orders');
var Occupancies = mongoose.model('Occupancies');
var Customers = mongoose.model('customers');
var should = chai.should();
var moment = require('moment');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Test read transactions by given time', function() {

    it('should return transactions by given time');

});

describe('Test create new transaction', function() {

    this.timeout(3000);
    var newCustomer;
    beforeEach(function(done) {
        orderTrans = {
            staffId: '59537c721dc4f93d3a7a7cab',
            note: '',
            occupancyId: '5954860e29fd4402b95a45fe',
            _id: '595478ee84d2217b2753f2be',
            updateAt: [],
            createdAt: '2017-06-29T03:50:06.030Z',
            status: 2,
            location: {
                _id: '59203df203b00119ac8d77ff',
                name: 'Green Space Chùa Láng'
            },
            customer: {
                fullname: 'NGÔ MỸ LINH',
                _id: '5924168b164cb9030cee92ed',
                phone: '01656021313',
                email: 'ngolinh0202@gmail.com'
            },
            promocodes: [],
            orderline: [{
                _id: '5948a7b54337ab19bc41d21b',
                productName: 'mountain dew',
                price: 8000,
                subTotal: 32000,
                quantity: '4',
            }, {
                _id: '59477a06906ff0639b52135b',
                productName: 'sting',
                price: 8000,
                subTotal: 16000,
                quantity: '2',
            }],
            total: 48000
        }

        otherTrans = {
            transType: 1,
            desc: 'occ trans', // explain
            amount: 1000,
        }

        customer = {
			firstname: 'A',
			middlename: 'B',
			lastname: 'C',
			fullname: 'C B A',
			gender: 1,
			birthday: new Date ('1989-09-25'),
			phone: '0965999999',
			edu: {},
			email: 'huedino.231@gmail.com', // manuallt required in some cases
			isStudent: true,
			checkinStatus: false,
		};

        Customers.create (customer, function (err, cus){
			if (err){
				console.log (err)
				return
			}

			newCustomer = cus;
			occTrans = {
	            _id: '5954860e29fd4402b95a45fe',
	            __v: 0,
	            note: '',
	            checkoutTime: moment ().add (-1, 'hour'),
	            price: 10000,
	            oriUsage: 0,
	            usage: 1,
	            total: 10000,
	            updateAt: [],
	            status: 2,
	            customer: {
	                fullname: 'C B A',
	                _id: newCustomer._id,
	                phone: '0965999999',
	                email: 'huedino.231@gmail.com',
	                isStudent: true
	            },
	            promocodes: [{
	                redeemData: [Object],
	                priority: 1,
	                codeType: 2,
	                name: 'STUDENTPRICE'
	            }],
	            service: { name: 'individual common', price: 15000 },
	            checkinTime: moment ().add (-2, 'hour'),
	            paymentMethod: []
	        }

	        Occupancies.create(occTrans, function(err, occ){
	        	if (err){
					console.log (err)
					return
				}
				done ();
	        })
		});
    });
    afterEach(function(done) {
        Transactions.remove({}, function(err, data) {
            if (err) {
                console.log(err)
                return
            }
            Orders.remove({}, function(err, data) {
                if (err) {
                    console.log(err)
                    return
                }
                Occupancies.remove({}, function(err, data) {
	                if (err) {
	                    console.log(err)
	                    return
	                }
	                Customers.remove({}, function(err, data) {
		                if (err) {
		                    console.log(err)
		                    return
		                }
		                done()
		            });
	            });
            });
        });
    })

    it('should create new order transaction when make order', function() {
        chai.request(server)
            .post('/orders/confirm')
            .send({ data: orderTrans })
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                	console.log(res.body.data)
                    expect(res.body.data.message).to.equal('success')
                    Transactions.findOne({}, function(err, trans) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        expect(trans.transType).equal(2)
                        expect(trans.desc).equal('order trans')
                        expect(trans.amount).equal(48000)
                        Orders.findOne({}, function(err, order) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            expect(trans.sourceId).equal(order._id)
                            done()
                        })

                    })
                }
            });
    });

    it('should create new occ transaction when checkout occ', function() {
    	chai.request(server)
            .post('/checkout')
            .send({ data: occTrans })
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    expect(res.body.data.message).to.equal('success')
                    Transactions.findOne({}, function(err, trans) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        expect(trans.transType).equal(1)
                        expect(trans.desc).equal('occ trans')
                        expect(trans.amount).equal(10000)
                        Occupancies.findOne({}, function(err, occ) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            expect(trans.sourceId).equal(occ._id)
                            done()
                        })
                    })
                }
            });
    });

    it('should create new order transaction when checkout occ include order', function() {

    });

    it('should create new deposit transaction when add new deposit', function() {

    });

    it('should create new deposit transaction when checkout with account', function() {

    });

    it('should create new storage transaction when add storages (inbound)', function() {

    });

    it('should create new storage transaction when return storages (outbound)', function() {

    });

    it('should create new other transaction when occur any other actions related to cash in, cash out', function(done) {
        chai.request(server)
            .post('/transactions/create')
            .send({ data: otherTrans })
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    res.should.to.have.status(200);
                    expect(res.body.data.tranType).to.equal(1)
                    expect(res.body.data.desc).to.equal('occ trans')
                    expect(res.body.data.amount).to.equal(1000)
                }
                done();
            });
    });

});
