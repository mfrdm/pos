var moment = require('moment');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var storeId = '58eb474538671b4224745192';
var staffId = '58eb474538671b4224745192';
chai.use(chaiHttp);

var testTool = function(){

	this.getRequest = function(url, query, cb){
		return chai.request(server)
            .get(url)
            .query(query)
            .end(function(err, res) {
            	if(err){throw err};
            	cb(res);
            })
	}

	this.postRequest = function(url, data, cb){
		return chai.request(server)
            .post(url)
            .send({data:data})
            .end(function(err, res) {
            	if(err){throw err};
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
        account:[],
        isStudent: false,
        checkinStatus: false,
	};

	this.mockProducts = [
		{
            name: 'Group Common',
            price: 15000,
            category: 1,
            createdAt: moment().endOf('day')
        },
		{
            name: 'mountain dew',
            price: 8000,
            category: 1,
            createdAt: moment().startOf('day')
        },
        {
            name: 'sting',
            price: 8000,
            category: 1,
            createdAt: moment().endOf('day')
        }
	];

	this.mockOccNotCheckin = {
		service: {
            price: 15000,
            name: 'Group Common'
        },
        customer: {
        	_id: {type: mongoose.Schema.Types.ObjectId},
			fullname: {type: String},
			phone: {type: String},
			email: {type: String}, // optional. added if exists
			isStudent: {type: Boolean},
        },
        checkinTime:moment().startOf('day').add(5,'h'),
        location: {_id: storeId},
        staffId: staffId,
	}
}

module.exports = new testTool();