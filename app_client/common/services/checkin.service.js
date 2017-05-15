angular.module ('posApp')
	.service ('CheckinService', ['$http','$q', CheckinService])

function CheckinService ($http, $q){

	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/checkin/search-customers',
			params:{
				input:input
			}
		})
	}

	//Validate Promote Code
	this.validatePromoteCode = function(data){
		return $http({
			method: 'GET',
			url: '/checkin/validate-promotion-code',
			params:{
				codes:data
			}
		})
	}

	//Get all checked in customer
	this.getCheckinList = function(query){
		query = query ? query : {};
		return $http({
			method:'GET',
			url:'/checkin',
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

	this.createOne = function (userId, data) {
		return $http({
			method:'POST',
			url:'/checkin/customer/' + userId,
			data: JSON.stringify({data: data}),
		});
		// return $q.resolve({data: data})
	};

	this.readOneParent = function(id){
		return $http({
			method:'GET',
			url:'/api/orders/order/'+id
		})
	}
	//Update new Order
	this.updateOne = function(id, data){
		return $http({
			method: 'POST',
			url: '/api/orders/order/'+ id +'/edit',
			data: JSON.stringify({
				$set: { orderline: data }
			})
		})
	};

	//Get parents order
	this.readSomeParent = function(){
		return $http({
			method:'GET',
			url:'/api/orders',
			params: {
				status:1,
			},
		})
	}

	//Checkout for customer
	this.confirmCheckout = function(order){
		return $http({
			url:'/checkout',
			method:'POST',
			data:JSON.stringify({data:order})
		})
	};

	this.readInvoice = function(id){
		return $http({
			url: '/checkout/invoice/'+id,
			method:'GET'
		})
	}
}
