angular.module ('posApp')
	.service ('CheckinService', ['$http','$q', CheckinService])

function CheckinService ($http, $q){

	// //Search Service
	// this.searchCustomers = function(input){
	// 	var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
	// 	return $http({
	// 		method:'GET',
	// 		url:'/api/customers',
	// 		params:{
	// 				queryInput:JSON.stringify({
	// 				conditions: {$or: array},
	// 				projection: {firstname: 1, middlename:1, lastname: 1, phone: 1, email: 1, edu:1,checkinStatus:1, parent:1, isStudent:1},
	// 				opts: null
	// 			})
 //  			}
	// 	})
	// }

	this.searchCustomers = function(input){
		return $http({
			method:'GET',
			url:'/checkin/search-customers',
			params: {input: input}
		});
	}	

	//Validate Promote Code
	this.validatePromoteCode = function(data){
		return $http({
			method: 'GET',
			url: '/checkin/validate-promotion-code',
			params:
				{data:JSON.stringify({
									codes:data.codes,
									isStudent:data.isStudent
								})}
		})
	}

	this.getCheckedinList = function(query){
		query.status = query.status ? query.status : 4; // get all by default

		return $http({
			method:'GET',
			url:'/checkin',
			params: query,
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
			url:'/occupancies/occupancy/'+id
		})
	}
	//Update new Order
	this.updateOne = function(id, service, parent){
		return $http({
			method: 'POST',
			url: '/checkin/customer/edit/'+id,
			data: JSON.stringify({
				$set: { service: service, parent:parent }
			})
		})
	};


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
