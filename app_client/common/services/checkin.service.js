var checkinService = function($http){

	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}

	//Get all checked in customer
	this.getDataOrderCheckin = function(){
		return $http({
			method:'GET',
			url:'/api/orders',
			params: {
				queryInput: JSON.stringify({
					conditions: {status:1},
					projection: null,
					opts: null
				})
			}
		})
	}

	//Get data from 1 customer by ID
	this.getDataOneCustomer = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}

	this.createOne = function (userId, data) {
		return $http({
			method:'POST',
			url:'/checkin/' + userId,
			data: JSON.stringify(data),
		});
	};

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

	//Checkout for customer
	this.postCheckOut = function(id){
		return $http({
			url:'/api/orders/order/'+id+'/edit',
			method:'POST',
			data:JSON.stringify({
				status:2
			})
		})
	};
}

app.service('checkinService', ['$http', '$window',  checkinService])