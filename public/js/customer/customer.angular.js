var app = angular.module('posApp', ['ngRoute']);

app.config(["$routeProvider",function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl : "/angular/readCreateCustomer",
			controller:"CreatCustomerCtrl",
			controllerAs:"vm"
		})
		.otherwise({
			redirect:'/'
		});
	// $locationProvider.html5Mode(true);
}]);