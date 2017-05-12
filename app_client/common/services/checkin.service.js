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
					projection: {firstname: 1, middlename:1, lastname: 1, phone: 1, email: 1, edu:1, parent:1},
					opts: null
				})
			}
		})
	}

	//Validate Promote Code
	this.validatePromoteCode = function(data){
		var dataTest = [{_id:'591023ab5c05325a32533a04', 'name':'1hourcommon', conflicted:[{name:'yeugreenspace'}]}, {_id:'591023ab5c05325a32533a08', 'name':'2hourcommon', conflicted:[{name:'yeugreenspace'}]}, {_id:'591023ab5c05325a32533a12', 'name':'stu', conflicted:[]}]
		// return $http({
		// 	method: 'GET',
		// 	url: '/checkin/validate-promotion-code',
		// 	params:{
		// 		codes:data
		// 	}
		// })
		var sameList = []
		dataTest.map(function(item){
			if ((data.filter(function(ele){
				return ele == item.name
			})).length !=0){
				sameList.push(item)
			}
		})
		
		return $q.resolve({data: {data:sameList}})
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

	this.getStudentCode = function(){
		dataCode = {name:'student', _id:'591023ab5c05325a32533a08'}
		return $q.resolve({data: {data:dataCode}})
	}

	// //Get data from 1 customer by ID
	// this.getDataOneCustomer = function(id){
	// 	return $http({
	// 	method:'GET',
	// 		url:'api/customers/customer/'+id
	// 	})
	// }
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
