process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var mongoose = require('mongoose');
var Transactions = mongoose.model('transactions');
var Orders = mongoose.model('orders');
var Occupancies = mongoose.model('Occupancies');
var Customers = mongoose.model('customers');
var Deposits = mongoose.model('Deposits');
var Products = mongoose.model('products');
var Storage = mongoose.model('storages');
var should = chai.should();
var moment = require('moment');
var expect = chai.expect;
var request = require('request');
var testTool = require('../../tools/mongoScripts/testing.tool')
var MakeTransaction = require('../../tools/node/makeTransaction.tool');

chai.use(chaiHttp);

describe('Test', function(){

    this.timeout(3000);

    it('should run', function(done){
        var a = [1,2,3];
        var b = a;
        b[2] = 5;
        delete b[1]
        console.log(a, b)
        done()
    })

})

xdescribe('Test read transactions by given time', function() {
    this.timeout(3000);
    var newCustomer, newProducts;
    
    var mockCustomer = testTool.mockCustomer;

    var mockProducts = testTool.mockProducts

    var mockOcc = testTool.mockOccNotCheckout;

    beforeEach(function(done){
        Customers.create(mockCustomer, function(err, data){
            if(err){throw err};
            newCustomer = data;
            Products.insertMany(mockProducts, function(err, data){
                if(err){throw err};
                newProducts = data;
                done();
            })
        })
    })

    afterEach(function(done){
        Customers.remove({}, function(err, data){
            if(err){throw err};
            Products.remove({}, function(err, data){
                if(err){throw err};
                Occupancies.remove({}, function(err, data){
                    if(err){throw err};
                    done();
                })
            })
        })
    })
    
    it('should return transactions by given time', function(done){
        var occ = testTool.mockOccNotCheckin;
        occ.customer = {}
        occ.customer._id = newCustomer._id;
        testTool.postRequest('/checkin/customer/'+newCustomer._id, {occupancy:occ}, function(res){
            Occupancies.findOne({}, function(err, occ){
                if(err){throw err};
                Customers.findOne({}, function(err, cus){
                    if(err){throw err};
                    console.log(occ);
                    testTool.getRequest('/checkout/invoice/'+occ._id, {}, function(res){
                        console.log(res.body)
                        testTool.postRequest('/checkout', res.body.data, function(res){
                            Occupancies.find({}, function(err, occ){
                                if(err){throw err};
                                console.log(occ)
                                Customers.findOne({}, function(err, cus){
                                    console.log(cus);
                                    done()
                                })
                            })
                        })
                    })
                })
            })
        })
    });

});

xdescribe('Test create new transaction', function() {

    this.timeout(3000);
    var newCustomer, newOcc, newOrder, newDeposit, newProductsList, deposit, order, storage;
    beforeEach(function(done) {
        otherTrans = {
            transType: 6,
            desc: 'other trans', // explain
            amount: 1000,
        }

        customer = {
            firstname: 'A',
            middlename: 'B',
            lastname: 'C',
            fullname: 'C B A',
            gender: 1,
            birthday: new Date('1989-09-25'),
            phone: '0965999999',
            edu: {},
            email: 'huedino.231@gmail.com', // manuallt required in some cases
            isStudent: false,
            checkinStatus: true,
        };
        products = [{
            name: 'mountain dew',
            price: 8000,
            category: 1,
            createdAt: new Date()
        }, {
            name: 'sting',
            price: 8000,
            category: 1,
            createdAt: new Date()
        }];
        Products.insertMany(products, function(err, data) {
            if (err) {
                console.log(err)
                return
            };
            newProductsList = data

            Customers.create(customer, function(err, cus) {
                if (err) {
                    console.log(err)
                    return
                };
                newCustomer = cus;
                occ = {
                    checkoutTime: moment().add(-1, 'hour'),
                    price: 15000,
                    oriUsage: 0,
                    usage: 1,
                    total: 15000,
                    updateAt: [],
                    status: 2,
                    customer: {
                        fullname: 'C B A',
                        _id: newCustomer._id,
                        phone: '0965999999',
                        email: 'huedino.231@gmail.com',
                        isStudent: false
                    },
                    promocodes: [],
                    service: { name: 'individual common', price: 15000 },
                    checkinTime: moment().add(-2, 'hour'),
                    paymentMethod: []
                };

                Occupancies.create(occ, function(err, data) {
                    if (err) {
                        console.log(err)
                        return
                    }
                    newOcc = data;
                    order = {
                        occupancyId: newOcc._id,
                        createdAt: moment(),
                        status: 2,
                        customer: {
                            fullname: 'C B A',
                            _id: newCustomer._id,
                            phone: '0965999999',
                            email: 'huedino.231@gmail.com',
                            isStudent: false
                        },
                        promocodes: [],
                        orderline: [{
                            _id: newProductsList[0]._id,
                            productName: 'mountain dew',
                            price: 8000,
                            subTotal: 32000,
                            quantity: 4,
                        }, {
                            _id: newProductsList[1]._id,
                            productName: 'sting',
                            price: 8000,
                            subTotal: 16000,
                            quantity: 2,
                        }],
                        total: 48000
                    };

                    deposit = {
                        total: 400000,
                        createdAt: moment(),
                        status: 2,
                        location: { _id: '59203df203b00119ac8d77ff' },
                        customer: {
                            fullname: 'C B A',
                            _id: newCustomer._id,
                            phone: '0965999999',
                            email: 'huedino.231@gmail.com',
                            isStudent: false
                        },
                        paymentMethod: { name: 'cash' },
                        promocodes: [],
                        account: {
                            name: '3h1d30dCommon',
                            price: 400000,
                            amount: 3,
                            unit: 'hour',
                            desc: '',
                            services: ['group common', 'individual common'],
                            label: {
                                vn: 'Combo 30 ngày / 3 giờ 1 ngày',
                                en: 'Combo 30 days / 3 hours per day'
                            },
                            recursive: {
                                isRecursive: true,
                                lastRenewDate: '2017-06-30T04:56:48.738Z',
                                renewNum: 0,
                                maxRenewNum: 29,
                                recursiveType: 1,
                                baseAmount: 3
                            },
                            expireDateNum: 30,
                            grouponable: false,
                            start: '2017-06-29T17:00:00.000Z'
                        },
                        groupon: { isLeader: false },
                        quantity: 1
                    }
                    storage = {
                        storeId: '59203df203b00119ac8d77ff',
                        createdAt: moment(),
                        itemList: [ { itemId: newProductsList[1]._id, quantity: 2 } ] 
                    }

                    done()
                });
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
                        Deposits.remove({}, function(err, data) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            Storage.remove({}, function(err, data) {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                                done()
                            });
                        });
                    });
                });
            });
        });
    })

    xdescribe('order trans', function() {
        it('should create new order transaction when make order', function() {
            chai.request(server)
                .post('/orders/confirm')
                .send({ data: order })
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
                            expect(trans.transType).equal(2)
                            expect(trans.desc).equal('order trans')
                            expect(trans.amount).equal(48000)
                            Orders.findOne({}, function(err, order) {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                                expect(trans.sourceId.toString()).equal(order._id.toString())
                                done()
                            })

                        })
                    }
                });
        });
    });

    xdescribe('occ trans', function() {
        it('should create new occ transaction when checkout occ', function(done) {
            chai.request(server)
                .post('/checkout')
                .send({ data: newOcc })
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
                            expect(trans.amount).equal(15000)
                            Occupancies.findOne({}, function(err, occ) {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                                expect(trans.sourceId.toString()).equal(occ._id.toString())
                                done()
                            })
                        })
                    }
                });
        });
    });
    xdescribe('deposit trans', function() {
        it('should create new deposit transaction when add new deposit', function(done) {
            chai.request(server)
                .post('/deposits/create')
                .send({ data: deposit })
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
                            expect(trans.transType).equal(5)
                            expect(trans.desc).equal('deposit trans')
                            expect(trans.amount).equal(400000)
                            Deposits.findOne({}, function(err, depo) {
                                if (err) {
                                    console.log(err)
                                    return
                                }
                                expect(trans.sourceId.toString()).equal(depo._id.toString())
                                done()
                            })
                        })
                    }
                });
        });
    });

    it('should create new deposit transaction when checkout with account', function() {

    });

    it('should create new storage transaction when add storages (inbound)', function() {
        chai.request(server)
            .post('/storages/create')
            .send({ data: storage })
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
                        expect(trans.transType).equal(4)
                        expect(trans.desc).equal('outbound trans')
                        expect(trans.amount).equal(16000)
                        Storage.findOne({}, function(err, data) {
                            if (err) {
                                console.log(err)
                                return
                            }
                            expect(trans.sourceId.toString()).equal(data._id.toString())
                            done()
                        })
                    })
                }
            });
    });

    it('should create new storage transaction when return storages (outbound)', function() {

    });

    xit('should create new other transaction when occur any other actions related to cash in, cash out', function(done) {
        chai.request(server)
            .post('/transactions/create')
            .send({ data: otherTrans })
            .end(function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    res.should.to.have.status(200);
                    Transactions.findOne({}, function(err, trans) {
                        if (err) {
                            console.log(err)
                            return
                        }
                        expect(trans.transType).equal(6)
                        expect(trans.desc).equal('other trans')
                        expect(trans.amount).equal(1000);
                        done()
                    })
                }
            });
    });

});
