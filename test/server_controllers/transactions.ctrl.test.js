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

// checkin and checkout for user no order
function checkInOut (start, end, newCustomer, cb){
    var occ = testTool.mockOccNotCheckin;
    occ.customer = {}
    occ.customer._id = newCustomer._id;
    occ.checkinTime = moment().startOf('day').add(start,'h');
    occ.checkoutTime = moment().startOf('day').add(end,'h');
    testTool.postRequest('/checkin/customer/'+newCustomer._id, {occupancy:occ}, function(res){
        testTool.getRequest('/checkout/invoice/'+res.body.data.occupancy._id, {}, function(res){
            testTool.postRequest('/checkout', res.body.data, function(res){
                cb();
            })
        })
    })
}

// create transactions
function addTrans (time, cb){
    var mock = {
        transType: 1,
        desc: 'occ trans',
        amount: 15000,
        sourceId: '595c91bbb3195e2d7acc1b84',
        createdAt: moment().startOf('day').add(time,'h'),
    }
    testTool.postRequest('/transactions/create', mock, function(){
        cb();
    })
}

xdescribe('Test read transactions by given time', function() {
    this.timeout(3000);
    var newCustomer, newProducts;
    
    var mockCustomer = testTool.mockCustomer;

    var mockProducts = testTool.mockProducts

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
                    Transactions.remove({}, function(err, data){
                        if(err){throw err};
                        done();
                    })
                })
            })
        })
    })
    
    it('should return transactions by given time', function(done){
        addTrans(1, function(){
            addTrans(2, function(){
                addTrans(3, function(){
                    addTrans(7, function(){
                        // Get trans by given time
                        var start = moment().startOf('day').add(1.5,'h');
                        var end = moment().startOf('day').add(5,'h');
                        testTool.getRequest('/transactions', {start:JSON.stringify(start), end:JSON.stringify(end)}, function(res){
                            expect(res.body.data.length).to.equal(2);
                            var created1 = +moment().startOf('day').add(2,'h');
                            var start1 = new Date(res.body.data[0].createdAt);
                            expect(+start1).to.equal(created1)

                            var created2 = +moment().startOf('day').add(3,'h');
                            var start2 = new Date(res.body.data[1].createdAt);
                            expect(+start2).to.equal(created2)
                            done();
                        })
                    })
                })
            })
        })
    });
});

describe('Test create new transaction', function() {
    this.timeout(3000);
    var newCustomer, newProducts;
    
    var mockCustomer = testTool.mockCustomer;

    var mockProducts = testTool.mockProducts

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
                    Transactions.remove({}, function(err, data){
                        if(err){throw err};
                        Orders.remove({}, function(err, data){
                            if(err){throw err};
                            Deposits.remove({}, function(err, data){
                                if(err){throw err};
                                Storage.remove({}, function(err, data){
                                    if(err){throw err};
                                    done();
                                })
                            })
                        })
                    })
                })
            })
        })
    })
    
    xit('should create new occ transaction when checkout occ', function(done){
        checkInOut(1,2,newCustomer, function(){ //Checkin-out 1st time
            checkInOut(4,7,newCustomer, function(){ // Checkin-out 2nd time
                // Should already have 2 transaction created by checkout action, and 2 occupancies
                Occupancies.find({}, function(err, occ){
                    Transactions.find({}, function(err, data){
                        if(err){throw err};
                        expect(data.length).to.equal(2);

                        expect(data[0].transType).to.equal(1);
                        expect(data[0].desc).to.equal('occ trans');
                        expect(data[0].amount).to.equal(15000);
                        expect(data[0].sourceId.toString()).to.equal(occ[0]._id.toString()); // occupancy[0] responding with trans[0]

                        expect(data[1].transType).to.equal(1);
                        expect(data[1].desc).to.equal('occ trans');
                        expect(data[1].amount).to.equal(45000);
                        expect(data[1].sourceId.toString()).to.equal(occ[1]._id.toString()); // occupancy[1] responding with trans[1]
                        done();
                    })
                })
            })
        })
    });

    it('should create new order transaction when make order', function(done){
        // create order
        var order = testTool.mockOrderBeforeInvoice;
        order.customer._id = newCustomer._id;
        order.orderline.map(function(item){
            item._id = newProducts.filter(function(ele){
                return ele.name == item.productName;
            });
        });
        testTool.postRequest('/orders/checkout', order, function(res){
            testTool.postRequest('/orders/confirm', res.body.data, function(res){
                Orders.findOne({},function(err, order){
                    if(err){throw err};
                    // After create Order, should have transaction now
                    Transactions.find({}, function(err, trans){
                        if(err){throw err};
                        expect(trans.length).to.equal(1);

                        expect(trans[0].transType).to.equal(2);
                        expect(trans[0].desc).to.equal('order trans');
                        expect(trans[0].amount).to.equal(16000);
                        expect(trans[0].sourceId.toString()).to.equal(order._id.toString())
                        done();
                    })
                })
            })
        })
    });

    xit('should create new deposit transaction when add new deposit', function(done){
        // create deposit
        var deposit = testTool.mockDeposit;
        deposit.customer._id = newCustomer._id;

        testTool.getRequest('/deposits/invoice', {deposit: JSON.stringify (deposit)}, function(res){
            testTool.postRequest('/deposits/create', res.body.data, function(){
                //After create deposit now should have 1 transaction
                Deposits.findOne({}, function(err, deposit){
                    if(err){throw err};
                    Transactions.find({}, function(err, trans){
                        if(err){throw err};
                        expect(trans.length).to.equal(1);

                        expect(trans[0].transType).to.equal(5);
                        expect(trans[0].desc).to.equal('deposit trans');
                        expect(trans[0].amount).to.equal(190000);
                        expect(trans[0].sourceId.toString()).to.equal(deposit._id.toString())
                        done();
                    })
                })
            })
        })
    })

    xit('should create new storage transaction when return storages (outbound)', function(done){
        // create outbound
        testTool.mockOutbound.itemList.map(function(item){
            item.itemId = newProducts.filter(function(ele){
                return item.name == ele.name;
            })[0]._id
        });

        testTool.postRequest('/storages/create', testTool.mockOutbound, function(res){
            Storage.findOne({}, function(err, storage){
                if(err){throw err};
                Transactions.find({}, function(err, trans){
                    if(err){throw err};
                    expect(trans.length).to.equal(1);

                    expect(trans[0].transType).to.equal(4);
                    expect(trans[0].desc).to.equal('outbound trans');
                    expect(trans[0].amount).to.equal(32000);
                    expect(trans[0].sourceId.toString()).to.equal(storage._id.toString())
                    done();
                })
            })
        })
    })

    xit('should create new storage transaction when add storages (inbound)', function(done){
        // create inbound
        testTool.mockInbound.itemList.map(function(item){
            item.itemId = newProducts.filter(function(ele){
                return item.name == ele.name;
            })[0]._id
        });

        testTool.postRequest('/storages/create', testTool.mockInbound, function(res){
            Storage.findOne({}, function(err, storage){
                if(err){throw err};
                Transactions.find({}, function(err, trans){
                    if(err){throw err};
                    expect(trans.length).to.equal(1);

                    expect(trans[0].transType).to.equal(3);
                    expect(trans[0].desc).to.equal('inbound trans');
                    expect(trans[0].amount).to.equal(-32000);
                    expect(trans[0].sourceId.toString()).to.equal(storage._id.toString())
                    done();
                })
            })
        })
    })

    xit('should create new other transaction when occur any other actions related to cash in, cash out', function(done){
        // create inbound
        
        testTool.postRequest('/transactions/create', testTool.mockTrans, function(res){
            Transactions.find({}, function(err, trans){
                if(err){throw err};
                expect(trans.length).to.equal(1);

                expect(trans[0].transType).to.equal(6);
                expect(trans[0].desc).to.equal('xxx');
                expect(trans[0].amount).to.equal(10000);
                done();
            })
        })
    })
});

describe('Test edit one transaction', function() {
    this.timeout(3000);
    var newCustomer, newProducts;
    
    var mockCustomer = testTool.mockCustomer;

    var mockProducts = testTool.mockProducts

    beforeEach(function(done){
        Customers.create(mockCustomer, function(err, data){
            if(err){throw err};
            newCustomer = data;
            Products.insertMany(mockProducts, function(err, data){
                if(err){throw err};
                newProducts = data;
                done()
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
                    Transactions.remove({}, function(err, data){
                        if(err){throw err};
                        Orders.remove({}, function(err, data){
                            if(err){throw err};
                            Deposits.remove({}, function(err, data){
                                if(err){throw err};
                                Storage.remove({}, function(err, data){
                                    if(err){throw err};
                                    done();
                                })
                            })
                        })
                    })
                })
            })
        })
    })

    it ('should edit order transaction info includes: total money, type, id of order', function(done){
        // create order
        var order = testTool.mockOrderBeforeInvoice;
        order.customer._id = newCustomer._id;
        order.orderline.map(function(item){
            item._id = newProducts.filter(function(ele){
                return ele.name == item.productName;
            });
        });
        testTool.postRequest('/orders/checkout', order, function(res){
            testTool.postRequest('/orders/confirm', res.body.data, function(res){
                Transactions.findOne({}, function(err, tran){

                    if(err){throw err};

                    var editData = {
                        transType: 3,
                        desc: 'abc',
                        amount: 2000,
                    };

                    testTool.postRequest('/transactions/edit/'+tran._id, editData, function(){
                        Transactions.findOne({}, function(err, data){
                            expect(data.transType).to.equal(3);
                            expect(data.desc).to.equal('abc');
                            expect(data.amount).to.equal(2000);
                            done();
                        })
                    })
                })
            })
        })
    })
});
