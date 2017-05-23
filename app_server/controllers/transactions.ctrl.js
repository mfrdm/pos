var validator = require ('validator');
var mongoose = require ('mongoose');
var Transactions = mongoose.model('transactions');
var moment = require ('moment');

module.exports = new TransactionCtrl();

function TransactionCtrl (){
	this.createATrans = function (req, res, next){
		
	}

}
