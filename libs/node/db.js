var mongoose = require('mongoose');

// Wrapper of a Mongoose DB

function MGDB (host, port, db, username, passwd){
	this.host = host;
	this.port = port;	
	this.username = username;
	this.passwd = passwd;
	this.db = db;	
}

MGDB.prototype = new function(){
	this.connect = function (){
		var dbDefault = 'erp';
		var dbURI = this.host ? this.host : 'localhost';
		var dbOptions = this.username && this.passwd ? {user: this.username, pass: this.passwd} : {};
		dbURI = this.port ? dbURI + ':' + this.port : dbURI;
		dbURI = this.db ? dbURI + '/' + this.db : dbURI + dbDefault;
		dbURI = 'mongodb://' + dbURI;
		mongoose.connect(dbURI, dbOptions);
		this.listenEvents (dbURI);
	};
 
	this.close = function (msg, callback){
		mongoose.connection.close(function () {
			console.log('Mongoose disconnected through ' + msg);
			callback();
		});
	};

	this.listenEvents = function(dbURI){
		var mgdb = this;
		mongoose.connection.on('connected', function () {
			console.log('Mongoose connected to ' + dbURI);
		});

		mongoose.connection.on('error',function (err) {
			console.log('Mongoose connection error: ' + err);
		});

		mongoose.connection.on('disconnected', function () {
			console.log('Mongoose disconnected');
		});

		// listen and close mongoose connection
		process.once('SIGUSR2', function () {
			mgdb.close('nodemon restart', function () {
				process.kill(process.pid, 'SIGUSR2');
			});
		});

		// listen and close mongoose connection
		process.on('SIGINT', function () {
			mgdb.close('app termination', function () {
				process.exit(0);
			});
		});

	};

}();

module.exports.MGDB = MGDB;
