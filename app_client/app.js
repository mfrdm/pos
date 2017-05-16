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
			resolve: {
				'checkAuth': ['$q', 'authentication','$location', '$rootScope', checkAuth]
			},			
			controller: 'LoginCtrl',
			controllerAs: 'vm',			
		})
		.when ('/register', {
			templateUrl: '/register',
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: 'RegisterCtrl',
			controllerAs: 'vm',
		})	

		.when('/checkin', {
			templateUrl : "/template/checkin",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller:"CheckinCtrl",
			controllerAs:"vm"
		})
		// .when('/checkin', {
		// 	templateUrl : "/template/newCheckin",
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
		// 	},			
		// 	controller:"NewCheckinCtrl",
		// 	controllerAs:"vm"
		// })		
		.when('/orders', {
			templateUrl : "/template/orders",
			controller:"OrderCtrl",
			controllerAs:"vm"
		})
		.when('/customers', {
			templateUrl : "/template/customers",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "CustomerCtrl",
			controllerAs:'vm'
		})
		.when('/bookings', {
			templateUrl: "/template/bookings",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "BookingCtrl",
			controllerAs: 'vm'
		})		
		// .when ('/assets', {
		// 	templateUrl: '/assets',
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication','$location', '$rootScope', checkAuth]
		// 	},
		// 	controller: 'assetsCtrl',
		// 	controllerAs: 'vm',
		// })
		// .when ('/fin', {
		// 	templateUrl: '/fin/costs',
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication','$location', '$rootScope', checkAuth]
		// 	},			
		// 	controller: 'costsCtrl',
		// 	controllerAs: 'vm',
		// })
		// .when("/attendance", {
		// 	templateUrl: "/template/attendances",
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
		// 	},			
		// 	controller: "AttendanceCtrl",
		// 	controllerAs: 'vm'
		// })
		// .when("/store", {
		// 	templateUrl: "/template/depts",
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
		// 	},			
		// 	controller: "DeptCtrl",
		// 	controllerAs: 'vm'
		// })
		// .when("/products", {
		// 	templateUrl: "/template/products",
		// 	resolve: {
		// 		'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
		// 	},			
		// 	controller: "ProductCtrl",
		// 	controllerAs: 'vm'
		// })
		// .when('/hr', {
		// 	templateUrl: "/template/employees",
		// 	controller: "EmployeeCtrl",
		// 	controllerAs: 'vm'
		// })
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

	var deferred = $q.defer();

	if (!authentication.isLoggedIn ()){
		if ($location.path() != '/login' && $location.path() != '/register'){
			Layout.model.dom.returnPage = $location.path();
			$location.path ('/login');
		}
		
	}
	else{
		if ($location.path() == '/login' || $location.path() == '/register'){
			$location.path (Layout.model.dom.returnPage);
		}
		else {
			Layout.model.dom.returnPage = $location.path();
		}	
	}

	deferred.resolve ();
	return deferred.promise;
}