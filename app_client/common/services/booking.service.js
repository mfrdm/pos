angular
	.module ('posApp')
	.service ('bookingService', ['$http', bookingService]);

function bookingService ($http){

	this.searchCustomer = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }},
		{"lastname" : { $regex: input, $options: 'i' }}]
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

	this.searchBooking = function(input){
		var array = [{"customer.firstname" : { $regex: input, $options: 'i' }},
		{"customer.lastname" : { $regex: input, $options: 'i' }}, 
		{"customer.email" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/bookings',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}

	this.readSome = function (){
		var url = '/api/bookings';
		return $http.get (url);				
	};
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/bookings/booking/'+id
		})
	}
	this.readOneCustomer = function(id){
		return $http({
		method:'GET',
			url:'api/customers/customer/'+id
		})
	}

	this.updateOne = function (id, data){
		var url = '/api/bookings/booking/' + id + '/edit';
		return $http.post (url, data);	
	}

	// this.deleteOne = function (id){
	// 	var url = '/api/bookings/booking/' + id + '/delete';
	// 	return $http.post (url, {});
	// }

	this.createOne = function (data){
		var url = '/api/bookings/create/';
		return $http.post (url, data);
	}

};
