var app = angular.module('posApp', ['ngRoute']);

app.config(["$routeProvider",function($routeProvider) {
	$routeProvider
		.when("/checkin", {
			templateUrl : "/angular/readMainCheckin",
			controller:"MainCheckinCtrl",
			controllerAs:"vm"
		})
		.when("/checkin/customer", {
			templateUrl : "/angular/readOneCusCheckin",
			controller:"CusCheckinCtrl",
			controllerAs:'vm'
		})
		.when("/checkin/checkout", {
			templateUrl : "/angular/readOneCusCheckout",
			controller:"CusCheckoutCtrl",
			controllerAs:'vm'
		})
		.when("/checkin/edit", {
			templateUrl : "/angular/readOneCusEdit",
			controller:"CusEditCtrl",
			controllerAs:'vm'
		})
		.otherwise({
			redirect:'/'
		});
	// $locationProvider.html5Mode(true);
}]);