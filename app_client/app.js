var app = angular.module ('posApp', ['ngRoute', 'datePicker']);

app
	.config (['$locationProvider', '$routeProvider', config])
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $("#mainContentDiv").foundation(); // initialize elements in ng-view
	    });
	})	
	// .controller ('ErrorCtrl', [ErrorCtrl])

function config ($locationProvider, $routeProvider){
	// $locationProvider.html5Mode (true);
	// $locationProvider.hashPrefix ('!');		
	$routeProvider
		.when ('/login', {
			templateUrl: '/login',
			// resolve: {
			// 	'checkPermission': ['$q', 'authentication', checkPermission]
			// },			
			controller: 'LoginCtrl',
			controllerAs: 'vm',			
		})
		.when ('/register', {
			templateUrl: '/register',
			controller: 'RegisterCtrl',
			controllerAs: 'vm',
		})		
		.when ('/assets', {
			templateUrl: '/assets',
			// resolve: {
			// 	'checkPermission': ['$q', 'authentication', checkPermission]
			// },
			controller: 'assetsCtrl',
			controllerAs: 'vm',
		})
		.when ('/fin', {
			templateUrl: '/fin/costs',
			controller: 'costsCtrl',
			controllerAs: 'vm',
		})
		.when('/checkin', {
			templateUrl : "/angular/checkin",
			controller:"CheckinCtrl",
			controllerAs:"vm"
		})
		.when('/orders', {
			templateUrl : "/angular/orders",
			controller:"OrderCtrl",
			controllerAs:"vm"
		})
		.when('/customers', {
			templateUrl : "/angular/customers",
			controller: "CustomerCtrl",
			controllerAs:'vm'
		})
		.when("/attendance", {
			templateUrl: "/angular/attendances",
			controller: "AttendanceCtrl",
			controllerAs: 'vm'
		})
		.when("/store", {
			templateUrl: "/angular/depts",
			controller: "DeptCtrl",
			controllerAs: 'vm'
		})
		.when("/products", {
			templateUrl: "/angular/products",
			controller: "ProductCtrl",
			controllerAs: 'vm'
		})
		.when('/hr', {
			templateUrl: "/angular/employees",
			controller: "EmployeeCtrl",
			controllerAs: 'vm'
		})
		.when('/bookings', {
			templateUrl: "/angular/bookings",
			controller: "BookingCtrl",
			controllerAs: 'vm'
		})
		.when('/combo', {
			templateUrl: "/angular/combo",
			controller: "ComboCtrl",
			controllerAs: 'vm'
		})
		.when ('/error', {
			templateUrl: "/error",
			controller: "ErrorCtrl",
			controllerAs: 'vm'			
		})
		.otherwise ({redirectTo: '/'});	
};

// Check if a user has permission to access a certain page or resource
function checkPermission ($q, authentication) {
	if (authentication.isLoggedIn ()){
		return {
			pass: true
		}
	}
	else{
		return {
			pass: false
		}
	}
}