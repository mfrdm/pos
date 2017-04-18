var app = angular.module ('posApp', ['ngRoute']);

function config ($routeProvider){
	$routeProvider
		.when ('/assets', {
			templateUrl: '/assets',
			controller: 'assetsCtrl',
			controllerAs: 'vm',
		})
		.when ('/fin/costs', {
			templateUrl: '/fin/costs',
			controller: 'costsCtrl',
			controllerAs: 'vm',
		})
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
		.when("/customers", {
			templateUrl : "/angular/readCustomers",
			controller: "CusSearchCtrl",
			controllerAs:'vm'
		})
		.when("/customers/create", {
			templateUrl : "/angular/readCreateCustomer",
			controller: "CusCreateCtrl",
			controllerAs:'vm'
		})
		.when("/customers/profile", {
			templateUrl : "/angular/readProfileCustomer",
			controller: "CusProfileCtrl",
			controllerAs:'vm'
		})
		.otherwise ({redirectTo: '/'});
};

app
	.config (['$routeProvider', config])
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $(document).foundation();
	    });
	});