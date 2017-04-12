var app = angular.module('checkinApp', ['ngRoute']);

app.config(["$routeProvider",function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl : "views/checkin/mainCheckin.html",
			controller:"MainCheckinCtrl",
			controllerAs:"vm"
		})
		.when("/customer", {
			templateUrl : "views/checkin/cusCheckin.html",
			controller:"CusCheckinCtrl",
			controllerAs:'vm'
		})
		.otherwise({
			redirect:'/'
		})
	// $locationProvider.html5Mode(true);
}]);

var MainCheckinCtrl = function(readCheckinService){
	var vm = this;
	// vm.submit = function(){
	// 	if(vm.text){
	// 		vm.list = vm.text;
	// 		vm.text = '';
	// 	}
	// };
	readCheckinService
		.then(function success(res){
			vm.userList = res.data.user.data
		}, function error(err){
			console.log(err)
		});

}

var CusCheckinCtrl = function(){
	var vm = this;

	vm.customer = 'cuong';
	vm.age = 18;
}

var readCheckinService = function($http){
	return $http({
		method:'GET',
		url:'/angularCheckin'
	})
}

// var searchCusService = function($http){
// 	return $http({
// 		method:'GET',
// 		url:'/'
// 	})
// }


app.controller('CusCheckinCtrl', CusCheckinCtrl)
	.controller('MainCheckinCtrl', MainCheckinCtrl)
	.service('readCheckinService', readCheckinService)