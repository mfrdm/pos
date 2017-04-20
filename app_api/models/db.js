var MGDB = require('../../libs/node/db').MGDB;
var helper = require('../../libs/node/helper');
var apiOptions = helper.getAPIOption();


// var host = 'localhost';
var host = '104.199.160.180';
var port = 27017;
var username = 'contentAdmin';
var passwd = 'greenspace';
var db = apiOptions.dbName;

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