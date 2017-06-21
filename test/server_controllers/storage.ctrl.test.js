process.env.NODE_ENV = "test";

var chai = require ('chai');
var chaiHttp = require ('chai-http');
var server = require ('../../app');
var mongoose = require ('mongoose');
var Products = mongoose.model ('products');
var Storage = mongoose.model ('storages');
var should = chai.should ();
var expect = chai.expect;
var moment = require ('moment');

chai.use (chaiHttp);

describe ('Product', function (){
	this.timeout(3000);
	var newProduct;
	beforeEach (function (done){
		ProductList = [{
			name: 'RedBull',
			price: 10000,
			category: 1,
			createdAt: new Date()
		}, {
			name: 'Table',
			price: 1000000,
			category: 4,
			createdAt: new Date()
		}];
		chai.request (server)
			.post ('/products/create')
			.send ({data: ProductList[0]})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					initialProduct = res.body.data;

				}
				done ();
			});
	});

	afterEach (function(done){
		Products.remove ({}, function (err, data){
			if (err){
				console.log (err)
				return
			}
			done ()
		});
	})

	it('should create product successfully', function(done){
		chai.request (server)
			.post ('/products/create')
			.send ({data: ProductList[1]})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					res.should.to.have.status (200);
					expect(res.body.data.name).to.equal('Table')
					expect(res.body.data.price).to.equal(1000000)
				}
				done ();
			});
	});

	it ('should edit product successfully', function(done){
		var editedProduct = ProductList[0];
		editedProduct.price = 2000
		editedProduct.name = 'Latte';
		var sentData = {$set:editedProduct}
		chai.request (server)
			.post ('/products/product/'+initialProduct._id+'/edit')
			.send ({data: sentData})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					res.should.to.have.status (200);
					expect(res.body.data.name).to.equal('Latte')
					expect(res.body.data.price).to.equal(2000)
				}
				done ();
			});
	});

	it ('should return one product by its id', function(done){
		chai.request (server)
			.get ('/products/product/'+initialProduct._id)
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					res.should.to.have.status (200);
					expect(res.body.data.name).to.equal('RedBull')
					expect(res.body.data.price).to.equal(10000)
				}
				done ();
			});
	});

	it ('should return err when create existed product', function(done){
		chai.request (server)
			.post ('/products/create')
			.send ({'data':ProductList[0]})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					expect(res.body.message).to.equal('Existed Product')
					expect(res.body.data[0].name).to.equal('RedBull')
				}
				done ();
			});
	});
});

describe('Storage', function(){
	this.timeout(3000);
	var newProducts, initialStorages, StorageList;
	beforeEach (function (done){
		var ProductList = [{
			name: 'RedBull',
			price: 10000,
			category: 1,
			createdAt: new Date()
		}, {
			name: 'Latte',
			price: 8000,
			category: 1,
			createdAt: new Date()
		}, {
			name: 'Haohao',
			price: 8000,
			category: 2,
			createdAt: new Date()
		}, {
			name: 'Oishi',
			price: 6000,
			category: 3,
			createdAt: new Date()
		}, {
			name: 'Table',
			price: 1000000,
			category: 4,
			createdAt: new Date()
		}];
		Products.insertMany(ProductList, function(err, list){
			if(err){
				console.log(err)
			}else{
				newProducts = list;
				console.log(newProducts)
				StorageList = [// [0][1][2] for calculate total storage, [3] for create new storage test; when search by time should return [0][1]
					{
						itemList:[
							{
								itemId:newProducts[0]._id,
								quantity:5,
								note:''
							},
							{
								itemId:newProducts[1]._id,
								quantity:10,
								note:''
							},
							{
								itemId:newProducts[2]._id,
								quantity:15,
								note:''
							}
						],
						createdAt: moment ().add (-5, 'hour'),
					}, {
						itemList:[
							{
								itemId:newProducts[0]._id,
								quantity:5,
								note:''
							},
							{
								itemId:newProducts[1]._id,
								quantity:10,
								note:''
							},
							{
								itemId:newProducts[2]._id,
								quantity:15,
								note:''
							}
						],
						createdAt: moment ().add (-4, 'hour'),
					}, {
						itemList:[
							{
								itemId:newProducts[0]._id,
								quantity:5,
								note:''
							},
							{
								itemId:newProducts[1]._id,
								quantity:5,
								note:''
							},
							{
								itemId:newProducts[2]._id,
								quantity:5,
								note:''
							}
						],
						createdAt: moment ().add (-1, 'hour'),
					}, {
						itemList:[
							{
								itemId:newProducts[0]._id,
								quantity:1,
								note:''
							},
							{
								itemId:newProducts[1]._id,
								quantity:1,
								note:''
							},
							{
								itemId:newProducts[2]._id,
								quantity:1,
								note:''
							}
						],
						createdAt: moment ().add (-3, 'day'),
					}
				];
				Storage.insertMany(StorageList.slice(0,3), function(err, storage){
					if(err){
						console.log(err)
					}else{
						initialStorages = storage
						done()
					}
				})
			}
		})

	});
	afterEach (function(done){
		Products.remove ({}, function (err, data){
			if (err){
				console.log (err)
				return
			}
			Storage.remove({}, function(err, data){
				if(err){
					console.log(err)
					return
				}
				done()
			})
		});
	});

	xit('create new storage successfully', function(done){
		chai.request (server)
			.post ('/storages/create')
			.send ({data: StorageList[3]})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					res.should.to.have.status (200);
					expect(res.body.data.itemList[0].quantity).to.equal(1)
				}
				done ();
			});
	})

	it('edit storage successfully', function(done){
		var editedStorage = {
			itemList:[
				{
					itemId:newProducts[0]._id,
					quantity:20,
					note:''
				},
				{
					itemId:newProducts[1]._id,
					quantity:10,
					note:''
				},
				{
					itemId:newProducts[2]._id,
					quantity:15,
					note:''
				},
				{
					itemId:newProducts[3]._id,
					quantity:100,
					note:''
				}
			],
			createdAt: moment ().add (-3, 'day')
		}
		var sentData = {$set:editedStorage}
		chai.request (server)
			.post ('/storages/storage/'+initialStorages[0]._id+'/edit')
			.send ({data: sentData})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					res.should.to.have.status (200);
					
					Storage.findById(res.body.data._id, function(err, storage){
						if(err){
							console.log(err)
						}else{
							expect(storage.itemList.length).to.equal(4);
							expect(storage.itemList[3].itemId.toString()).to.equal(newProducts[3]._id.toString())
							done ();
						}
					})
				}
				
			});
	});

	it('should return all storages made in during a specific duration', function(done){
		var startTime = moment ().add (-10, 'hour')
		var endTime = moment ().add (-2, 'hour')
		chai.request (server)
			.get ('/storages/')
			.query ({start: JSON.stringify(startTime), end:JSON.stringify(endTime)})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					var results = res.body.data;
					expect(results.length).to.equal(2);
					expect(results[0]._id).to.equal(initialStorages[0]._id.toString());
					expect(results[1]._id).to.equal(initialStorages[1]._id.toString())
					
					done()
				}
				
			});
	})

	it('should return current number of products with given start, end time', function(done){
		var startTime = moment ().add (-10, 'hour')
		var endTime = moment ().add (-2, 'hour')
		chai.request (server)
			.get ('/storages/total/')
			.query ({start: JSON.stringify(startTime), end:JSON.stringify(endTime)})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					var redbull = res.body.data.filter(function(ele){
						return ele.name == 'RedBull'
					})[0]
					var latte = res.body.data.filter(function(ele){
						return ele.name == 'Latte'
					})[0]
					var haohao = res.body.data.filter(function(ele){
						return ele.name == 'Haohao'
					})[0]
					var oishi = res.body.data.filter(function(ele){
						return ele.name == 'Oishi'
					})[0]
					expect(redbull.totalQuantity).to.equal(10)
					expect(latte.totalQuantity).to.equal(20)
					expect(haohao.totalQuantity).to.equal(30)
					expect(oishi.totalQuantity).to.equal(0)
					done()
				}
			});
	});

	it ('should return closest storage with given time', function(done){
		var time = moment ().add (-3, 'hour');
		chai.request (server)
			.get ('/storages/storage/')
			.query ({time: JSON.stringify(time)})
			.end (function (err, res){
				if (err){
					console.log (err);
				}
				else{
					expect(res.body.data._id).to.equal(initialStorages[1]._id.toString())
					done()
				}
			});
	});

})