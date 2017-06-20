angular.module ('posApp')
	.service ('StorageService', ['$http', StorageService])

function StorageService ($http){
	// get storage list
	this.readStorageList = function(startTime, endTime){
		return $http.get('/storages', {params:{start:JSON.stringify(startTime), end:JSON.stringify(endTime)}})
	}

	// add product
	this.createProduct = function(data){
		return $http.post('/products/create', {data:data})
	}

	// read all products
	this.readProducts = function(){
		return $http.get('/products')
	}

	// add storage
	this.createStorage = function(data){
		return $http.post('/storages/create', {data:data})
	}

	// read all products in storage
	this.readProductsQuantity = function(startTime, endTime){
		return $http.get('/storages/total', {params:{start:JSON.stringify(startTime), end:JSON.stringify(endTime)}})
	}

	// edit product
	this.editProduct = function(id, data){
		return $http.post('/products/product/'+id+'/edit', {data:data})
	}

	// edit storage
	this.editStorage = function(id, data){
		return $http.post('/storages/storage/'+id+'/edit', {data:data})
	}
	
}