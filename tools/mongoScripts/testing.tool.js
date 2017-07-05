var moment = require('moment');
var chai = require('chai');
var mongoose = require('mongoose');
var chaiHttp = require('chai-http');
var server = require('../../app');
var storeId = '58eb474538671b4224745192';
var staffId = '58eb474538671b4224745192';
chai.use(chaiHttp);

var testTool = function() {

    this.getRequest = function(url, query, cb) {
        return chai.request(server)
            .get(url)
            .query(query)
            .end(function(err, res) {
                if (err) {
                    throw err
                };
                cb(res);
            })
    }

    this.postRequest = function(url, data, cb) {
        return chai.request(server)
            .post(url)
            .send({ data: data })
            .end(function(err, res) {
                if (err) {
                    throw err
                };
                cb(res);
            })
    }

    this.mockCustomer = {
        firstname: 'A',
        middlename: 'B',
        lastname: 'C',
        fullname: 'C B A',
        gender: 1,
        birthday: moment('1994-09-15'),
        phone: '0965999999',
        edu: {},
        email: 'abc.231@gmail.com',
        account: [],
        isStudent: false,
        checkinStatus: false,
    };

    this.mockProducts = [{
        name: 'Group Common',
        price: 15000,
        category: 1,
        createdAt: moment().endOf('day')
    }, {
        name: 'mountain dew',
        price: 8000,
        category: 1,
        createdAt: moment().startOf('day')
    }, {
        name: 'sting',
        price: 8000,
        category: 1,
        createdAt: moment().endOf('day')
    }, ];

    this.mockOccNotCheckin = {
        service: {
            price: 15000,
            name: 'Group Common'
        },
        customer: {

        },
        checkinTime: moment().startOf('day').add(5, 'h'),
        location: { _id: storeId },
        staffId: staffId,
    }

    this.mockOrderBeforeInvoice = {
        "orderline": [{
            "quantity": 1,
            "productName": "mountain dew",
            "price": 8000,
        }, {
            "quantity": 1,
            "productName": "sting",
            "price": 8000,
        }],
        "staffId": staffId,
        "location": {
            "_id": storeId,
            "name": "Green Space Chùa Láng"
        },
        "customer": {
            "fullname": "C B A",
            "phone": "0965999999",
            "email": "abc.231@gmail.com",
            "isStudent": false
        },
    }

    this.mockDeposit = {
        "account": {
            "name": "3dCommon",
            "price": 190000,
            "amount": 24,
            "unit": "hour",
            "desc": "",
            "services": [
                "group common",
                "individual common"
            ],
            "label": {
                "vn": "Combo 3 ngày",
                "en": "3 day commbo"
            },
            "recursive": {
                "isRecursive": true,
                "lastRenewDate": "2017-07-05T08:17:05.148Z",
                "renewNum": 0,
                "maxRenewNum": 3,
                "recursiveType": 1,
                "baseAmount": 24
            },
            "expireDateNum": 7,
            "grouponable": false,
            "start": "2017-07-16T17:00:00.000Z"
        },
        "customer": {
            "fullname": "C B A",
            "phone": "0965999999",
            "email": "abc.231@gmail.com",
            "isStudent": false
        },
        "groupon": {},
        "location": {
            "_id": storeId
        }
    }

    this.mockOutbound = {
        "itemList": [{
            "name": "sting",
            "quantity": 2,
        }, {
            "name": "mountain dew",
            "quantity": 2,
        }],
        "storeId": storeId
    }

    this.mockInbound = {
        "itemList": [{
            "name": "sting",
            "quantity": -2,
        }, {
            "name": "mountain dew",
            "quantity": -2,
        }],
        "storeId": storeId
    }

    this.mockTrans = {
        "desc": "xxx",
        "amount": 10000,
        "transType": 6
    }
}

module.exports = new testTool();
