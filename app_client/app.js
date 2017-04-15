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
		.when("/customer/create", {
			templateUrl : "/angular/createNewCus",
			controller:"CusCreateCtrl",
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