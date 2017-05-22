angular.module ('posApp')
	.service ('OrderService', ['$http','$q', OrderService])

function OrderService ($http, $q){
	//Search Service
	this.searchCustomers = function(input){
		return $http({
			method:'GET',
			url:'/orders/search-customers',
			params: {input: input}
		});
	};

	this.getOrderList = function(query){
		query = query ? query : {};
		return $http({
			method:'GET',
			url:'/orders',
			params: query,
		})
	};

	this.readSomeProducts = function(){
		return $http({
			method:'GET',
			url:'/api/products'
		})
	};

	this.getInvoice = function(data){
		return $http({
			method:'POST',
			url:'/orders/checkout',
			data: JSON.stringify({data: data})
		})
	};

	this.confirmOrder = function(data){
		return $http({
			method:'POST',
			url:'/orders/confirm',
			data: JSON.stringify({data: data})
		})
	};
}