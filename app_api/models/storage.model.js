var mongoose = require('mongoose');
var moment = require ('moment');

var calculateSoldItems = function(startDate, endDate, product){
	// This function help calculate quantity, money sold of a specific product was sold in any duration
	// return subQuantity, subMoney;
}

var calculateTotalSold = function(){
	// return [{subQuantity, subMoney, product}], totalMoney, totalQuantity;
}

var StorageSchema = mongoose.Schema ({
	itemList:[
	{
		itemId:mongoose.Schema.Types.ObjectId,
		goodQuantity:Number,
		badQuantity:Number,
		note:String},
		{updatedAt: {
			time: {type: Date}, 
			explain: String,
			by: mongoose.Schema.Types.ObjectId
		}}// base on this to calculate sold items in any duration
	], // goodQuality refers to how many products are in good condition, badQuantity refers to how many bad; itemId is id of product/item created before
	createdAt: {type: Date, default: Date.now},
	
	storeId: mongoose.Schema.Types.ObjectId,
	compId: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model ('Storage', StorageSchema);
