var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Customers = mongoose.model ('customers');
var Promocodes = mongoose.model ('promocodes');
var Orders = mongoose.model ('orders');
var should = chai.should ();

describe ('Check out', function (){


});