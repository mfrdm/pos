var app = angular.module ('posApp', ['ngRoute']);

app
	.config (['$locationProvider', '$routeProvider', config])
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $("#mainContentDiv").foundation(); // initialize elements in ng-view
	    });
	})

function config ($locationProvider, $routeProvider){
	// $locationProvider.html5Mode (true);
	// $locationProvider.hashPrefix ('!');		
	$routeProvider
		.when ('/login', {
			templateUrl: '/login',
			// resolve: {
			// 	'checkAuth': ['$q', 'authentication','$location', checkAuth]
			// },			
			controller: 'LoginCtrl',
			controllerAs: 'vm',			
		})
		.when ('/register', {
			templateUrl: '/register',
			// resolve: {
			// 	'checkAuth': ['$q', 'authentication', '$location', checkAuth]
			// },			
			controller: 'RegisterCtrl',
			controllerAs: 'vm',
		})	

		.when('/checkin', {
			templateUrl : "/angular/checkin",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
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
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "CustomerCtrl",
			controllerAs:'vm'
		})
		.when ('/assets', {
			templateUrl: '/assets',
			resolve: {
				'checkAuth': ['$q', 'authentication','$location', '$rootScope', checkAuth]
			},
			controller: 'assetsCtrl',
			controllerAs: 'vm',
		})
		.when ('/fin', {
			templateUrl: '/fin/costs',
			resolve: {
				'checkAuth': ['$q', 'authentication','$location', '$rootScope', checkAuth]
			},			
			controller: 'costsCtrl',
			controllerAs: 'vm',
		})
		.when("/attendance", {
			templateUrl: "/angular/attendances",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "AttendanceCtrl",
			controllerAs: 'vm'
		})
		.when("/store", {
			templateUrl: "/angular/depts",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "DeptCtrl",
			controllerAs: 'vm'
		})
		.when("/products", {
			templateUrl: "/angular/products",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
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
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "BookingCtrl",
			controllerAs: 'vm'
		})
		// .when ('/error', {
		// 	templateUrl: "/error",
		// 	controller: "ErrorCtrl",
		// 	controllerAs: 'vm'			
		// })
		.otherwise ({redirectTo: '/checkin'});	
};

// Check if a user has permission to access a certain page or resource
function checkAuth ($q, authentication, $location, $rootScope) {
	var Layout = $rootScope.$$childHead.layout;
	Layout.model.dom.returnPage = $location.path();

	var deferred = $q.defer();

	if (!authentication.isLoggedIn ()){
		$location.path ('/login')
	}	

	deferred.resolve ();
	return deferred.promise;
}