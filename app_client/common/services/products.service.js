var productService = function($http){
	//Search Service
	this.searchProducts = function(input){
		var array = [{"name" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/products/',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}
	this.postCreateProduct = function(data){
		return $http({
			method:'POST',
			url:'/api/products/create',
			data:JSON.stringify(data)
		})
	}
	this.postSaveEdit = function(id, data){
		return $http({
			method:'POST',
			url:'/api/products/product/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}
}

app.service('productService', ['$http',productService])