var MGDB = require('../../libs/node/db').MGDB;
var helper = require('../../libs/node/helper');
var apiOptions = helper.getAPIOption();

// FIX: should use local when cannot connect to remote db
if (process.env.CONNECTED_DB == 'local'){
	var host = 'localhost';
	var port = 27017;
	var username = '';
	var passwd = '';
	var db = 'pos';	
}
else {
	var host = '104.199.160.180';
	var port = 27017;
	var username = 'contentAdmin';
	var passwd = 'greenspace';
	var db = 'pos';	
};

var mgdb = new MGDB (host, port, db, username, passwd);

mgdb.connect();

require('./users');
require('./customers');
require('./companies');
require('./depts');
require('./products');
require('./orders');
require('./costs');
require('./bookings');
require('./assets');
require('./attendances');
