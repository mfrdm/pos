var checkinService = function($http){
	this.readCheckinService = function(){
		return $http({
			method:'GET',
			url:'/angular/readSomeCusCheckin'
		})
		// console.log('test')
	}

	this.readOneCusService = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}

	this.readOneOrder = function(id){
		return $http({
			method:'GET',
			url:'/checkout/invoice/'+id
		})
	}

	this.checkInCustomerService = function(user, vm){
		return $http({
				method:'POST',
				url:'/checkin/'+user._id,
				data: JSON.stringify({
					total: 1,
					orderline: [
						{
							productName: vm.ordername
						}
					],
					customers:{
						customerId: user._id,
						firstname: user.firstname,
						lastname: user.lastname
					},
					storeId: "58eb474538671b4224745192",
					staffId: "58eb474538671b4224745192",	
					updateAt: {
						time: new Date('09/15/2017')
					}
				})
			})
	}

	this.checkOutCustomerService = function(id){
		return $http({
			url:'/api/orders/order/'+id+'/edit',
			method:'POST',
			data:JSON.stringify({
				status:2
			})
		})
	}

	// this.updateOrder = function(id, checkinTime, ){
	// 	return $http({
	// 		url:'/api/orders/order/'+id+'/edit',
	// 		method:'POST',
	// 		data:JSON.stringify({
	// 			checkinTime:
	// 		})
	// 	})
	// }

	this.searchService = function(input){
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
}

var checkinFactory = function(){
	var private_data;
	var setData = function(data){
		private_data = (data)
		console.log(private_data)
	};
	var getData = function(){
		console.log(private_data)
		return private_data;
	}
	return{
		setData : setData,
		getData : getData
	}
}

app.service('checkinService', ['$http', '$window',  checkinService])
app.factory('checkinFactory',checkinFactory)