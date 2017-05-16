angular.module ('posApp')
	.service ('OrderService', ['$http','$q', OrderService])

function OrderService ($http, $q){
	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
					queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: {firstname: 1, middlename:1, lastname: 1, phone: 1, email: 1, edu:1,checkinStatus:1, parent:1, isStudent:1},
					opts: null
				})
  			}
		})
	}
	this.getOrderList = function(query){
		query = query ? query : {};
		return $http({
			method:'GET',
			url:'/orders',
			params: {
				storeId:'59112972685d0127e59de962'
			},
		})
	}
	this.readSomeProducts = function(){
		return $http({
			method:'GET',
			url:'/api/products'
		})
	}

	this.createOrder = function(data){
		return $http({
			method:'POST',
			url:'/orders/checkout',
			data: JSON.stringify({data: data})
		})
	}

	this.confirmOrder = function(data){
		return $http({
			method:'POST',
			url:'/orders/confirm',
			data: JSON.stringify({data: data})
		})
	}
}