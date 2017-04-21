var app = angular.module ('posApp', ['ngRoute', "checklist-model"]);

function config ($routeProvider, $locationProvider){
	$routeProvider
		.when ('/login', {
			templateUrl: '/login',
			controller: 'loginCtrl',
			controllerAs: 'vm',
		})
		.when ('/assets', {
			templateUrl: '/assets',
			resolve: {
				'checkPermisson': ['$q', checkPermission]
			},
			controller: 'assetsCtrl',
			controllerAs: 'vm',
		})
		.when ('/fin/costs', {
			templateUrl: '/fin/costs',
			controller: 'costsCtrl',
			controllerAs: 'vm',
		})
		.when("/checkin", {
			templateUrl : "/angular/checkin",
			controller:"CheckinCtrl",
			controllerAs:"vm"
		})
		.when("/checkout", {
			templateUrl : "/angular/checkout",
			controller:"CheckoutCtrl",
			controllerAs:"vm"
		})
		.when("/customers", {
			templateUrl : "/angular/customers",
			controller: "CustomerCtrl",
			controllerAs:'vm'
		})
		.when("/attendances", {
			templateUrl: "/angular/attendances",
			controller: "AttendanceCtrl",
			controllerAs: 'vm'
		})
		.when("/stores", {
			templateUrl: "/angular/depts",
			controller: "DeptCtrl",
			controllerAs: 'vm'
		})
		.when("/products", {
			templateUrl: "/angular/products",
			controller: "ProductCtrl",
			controllerAs: 'vm'
		})
		.when("/staff", {
			templateUrl: "/angular/employees",
			controller: "EmployeeCtrl",
			controllerAs: 'vm'
		})
		.otherwise ({redirectTo: '/'});
	$locationProvider.html5Mode(true);
};

// FIX later
// Check if a user has permission to access a certain page or resource
function checkPermission ($q) {
	return $q.defer ()
}

app
	.config (['$routeProvider','$locationProvider', config])	
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $(document).foundation();
	    });
	})
