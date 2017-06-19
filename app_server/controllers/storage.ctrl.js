var validator = require ('validator');
var mongoose = require ('mongoose');
var Products = mongoose.model('products');
var Storages = mongoose.model('storages');
var moment = require ('moment');

module.exports = new StorageCtrl();

// function getProducts(cb){

// }

// productList: [{name:'RedBull', _id:''}, {name:'7up', _id:''}]
// storageList: [[{itemId:'', quantity:''}, {itemId:'', quantity:''}],[{itemId:'', quantity:''}, {itemId:'', quantity:''}]]
function calculate(productList, storageList){ //return quantity and amount for each product 
	var productArr = JSON.parse(JSON.stringify(productList))
	for(var j=0; j<productList.length; j++){
		productArr[j]["totalQuantity"] = 0;
		storageList.map(function(storage){
			for(var i=0; i<storage.itemList.length; i++){
				if(storage.itemList[i].itemId == productArr[j]._id){
					productArr[j].totalQuantity += storage.itemList[i].quantity;
				}
			}
		});
		productArr[j].totalValue = productArr[j]["totalQuantity"]*productArr[j].price
	}
	return productArr;
}

function StorageCtrl (){

	// Products
	this.createProduct = function(req, res, next){
		Products.find({name:req.body.data.name}, function(err, products){
			if (err){
				next (err)
				return
			}
			else{
				if(products.length > 0){
					res.json({message:'Existed Product', data:products})
				}
				else{
					var newProduct = new Products (req.body.data);

					newProduct.save (function (err, product){
						if (err){
							next (err);
							return 
						}
						else{
							res.json ({data: product});
							return
						}
					});
				}
			}
		})
		
	};

	this.editProduct = function(req, res, next){
		Products.findByIdAndUpdate(req.params.productId, req.body.data, {new: true}, function(err, product){
			if (err){
				next (err)
				return
			}
			else{
				res.json ({data: product});
				return
			}
		})
	};

	this.readOneProduct = function(req, res, next){
		Products.findById(req.params.productId, function(err, product){
			if (err){
				next (err)
				return
			}
			else{
				res.json ({data: product});
				return
			}
		})
	}

	// Storage
	this.createStorage = function(req, res, next){
		var newStorage= new Storages (req.body.data);

		newStorage.save (function (err, storage){
			if (err){
				next (err);
				return 
			}
			else{
				res.json ({data: storage});
				return
			}
		});
	};

	this.editStorage = function(req, res, next){
		Storages.findByIdAndUpdate(req.params.storageId, req.body.data, {new: true}, function(err, storage){
			if (err){
				next (err)
				return
			}
			else{
				res.json ({data: storage});
				return
			}
		})
	}

	this.readSomeStorages = function(req, res, next){
		var start = JSON.parse(req.query.start)
		var end = JSON.parse(req.query.end)
		Storages.find({createdAt:{$gte:start, $lte:end}}, function(err, data){
			res.json({data:data})
		})
	};

	this.readOneStorage = function(req, res, next){
		var time = JSON.parse(req.query.time)
		Storages.find({createdAt:{$lte:time}}, function(err, data){
			var storage = data.slice(-1)[0]
			res.json({data:storage})
		})
	}

	this.totalStorage = function(req, res, next){
		var start = JSON.parse(req.query.start)
		var end = JSON.parse(req.query.end);
		var productList = []
		var storageList = []
		Products.find({}, function(err, list){
			if(err){
				next(err)
				return
			}else{
				productList = list;
				Storages.find({createdAt:{$gte:start, $lte:end}}, function(err, data){
					storageList = data;
					console.log(storageList)
					res.json({data:calculate(productList, storageList)})
				})
			}
		})
	}

	this.readProducts = function(req, res, next){
		Products.find({}, function(err, list){
			if(err){
				next(err)
				return
			}else{
				res.json({data:list})
			}
		})
	}
}
