var attendanceService = function($http){
	//Search Service
	this.createOne = function(data){
		return $http({
			method:'POST',
			url:'/api/attendances/create',
			data:JSON.stringify(data)
		})
	}
	this.updateOne = function(id, data){
		return $http({
			method:'POST',
			url:'/api/attendances/attendance/'+id+'/edit',
			data:JSON.stringify(data)
		})
	}
	this.search = function(input){
		var array = [{"firstname" : { $regex: input, $options: 'i' }},{"lastname" : { $regex: input, $options: 'i' }},{"email" : { $regex: input, $options: 'i' }}, {"phone" : { $regex: input, $options: 'i' }}]
		return $http({
			method:'GET',
			url:'/api/users',
			params:{
				queryInput:JSON.stringify({
					conditions: {$or: array},
					projection: null,
					opts: null
				})
			}
		})
	}
	this.readOne = function(id){
		return $http({
		method:'GET',
			url:'api/attendances/attendance/'+id
		})
	}
}

app.service('attendanceService', ['$http',attendanceService])