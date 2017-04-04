var MGDB = require('../../libs/node/db').MGDB;

var host = 'localhost';
var port = 27017;
var username = '';
var passwd = '';
var db = 'test';

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