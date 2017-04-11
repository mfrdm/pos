angular.module('checkinApp', []);

var checkinCtrl = function(checkinService){
	var vm = this;

	checkinService
		.then(function success(res){
			console.log(res.data)
			vm.userList = res.data.user.data
		}, function error(err){
			console.log(err)
		})
}

var checkinService = function($http){
	return $http({
		method:'GET',
		url:'/angularCheckin'
	})
}

angular.module('checkinApp')
	.controller('checkinCtrl', checkinCtrl)
	.service('checkinService', checkinService)