var MGDB = require('../../libs/node/db').MGDB;

if (process.env.NODE_ENV === 'development'){
	var host = '127.0.0.1';
	var db = process.env.DB_NAME;
}
else if (process.env.NODE_ENV === 'test'){
	var host = '127.0.0.1';
	var db = process.env.TEST_DB_NAME;
}

else if (process.env.NODE_ENV === 'production'){
	var host = process.env.DB_REMOTE_HOST;
	var db = process.env.DB_NAME;
};

var port = process.env.DB_PORT;
var username = process.env.DB_USERNAME;
var passwd = process.env.DB_PWS;

var mgdb = new MGDB (host, port, db, username, passwd);

mgdb.connect();

require('./users');
require('./customers');
require('./companies');
require('./depts');
require('./products');
require('./promocodes');
require('./newPromocodes.model');
require('./orders');
require('./occupancy.model');
require('./newOccupancies.model');
require('./transactions');
require('./bookings');
require('./assets');
require('./attendances');
require('./deposit.model')
