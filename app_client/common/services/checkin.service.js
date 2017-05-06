angular.module ('posApp')
	.service ('CheckinService', ['$http','$q', CheckinService])

function CheckinService ($http, $q){

	//Search Service
	this.searchCustomers = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }}, {"lastname" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/customers',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: {firstname: 1, lastname: 1, phone: 1, email: 1},
					opts: null
				})
			}
		})
	}

	//Get all checked in customer
	this.getCheckinList = function(query){
		query = query ? query : {};
		return $http({
			method:'GET',
			url:'/api/orders',
			params: {
				// start: query.start ? query.start : new Date(),
				// end: query.end ? query.end : new Date().setDate(new Date().getDate() + 1),
				// storeId: query.storeId,
				// staffId: query.staffId,
				//status: query.status ? query.status : 1, // checked-in only
			},
		})
		// return $q.resolve({
		// 	data:{
		// 		data:[{
		// 			customer:{
		// 				firstname:'cuong',
		// 				lastname:'pham',
		// 				phone:['123'],
		// 				id:'12312312',
		// 				email:['cuong@df']
		// 			},
		// 			orderline:[
		// 				{
		// 					productName:'Common',
		// 					price:10000,
		// 					id:123,
		// 					quantity:3
		// 				}
		// 			]
		// 		}]
		// 	}
		// })
	}

	// //Get data from 1 customer by ID
	// this.getDataOneCustomer = function(id){
	// 	return $http({
	// 	method:'GET',
	// 		url:'api/customers/customer/'+id
	// 	})
	// }

	this.createOne = function (userId, data) {
		return $http({
			method:'POST',
			url:'/checkin/customer/' + userId,
			data: JSON.stringify({data: data}),
		});
		// return $q.resolve({data: data})
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
