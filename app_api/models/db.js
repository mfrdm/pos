var MGDB = require('../../libs/node/db').MGDB;

if (process.env.NODE_ENV === 'development'){
	var host = '127.0.0.1';
}
else if (process.env.NODE_ENV === 'production'){
	var host = process.env.DB_REMOTE_HOST;
};

var port = process.env.DB_PORT;
var username = process.env.DB_USERNAME;
var passwd = process.env.DB_PWS;
var db = process.env.DB_NAME;	

var mgdb = new MGDB (host, port, db, username, passwd);

mgdb.connect();

require('./users');
require('./customers');
require('./companies');
require('./depts');
require('./products');
require('./orders');
require('./transactions');
require('./bookings');
require('./assets');
require('./promocodes');
require('./attendances');
