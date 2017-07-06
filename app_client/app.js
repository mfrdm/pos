var app = angular.module ('posApp', ['ngRoute', 'checklist-model']);

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
			templateUrl : "/template/newCheckin",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller:"NewCheckinCtrl",
			controllerAs:"vm"
		})		
		.when('/orders', {
			templateUrl : "/template/newOrders",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},				
			controller:"NewOrdersCtrl",
			controllerAs:"vm"
		})
		.when('/customers', {
			templateUrl : "/template/newCustomers",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "NewCustomersCtrl",
			controllerAs:'vm'
		})		
		.when('/bookings', {
			templateUrl: "/template/newBookings",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "NewBookingCtrl",
			controllerAs: 'vm'
		})
		.when('/deposit', {
			templateUrl: "/template/deposit",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "DepositCtrl",
			controllerAs: 'vm'
		})
		.when('/promocodes', {
			templateUrl: "/template/promocodes",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "PromocodesCtrl",
			controllerAs: 'vm'
		})
		.when('/storage', {
			templateUrl: "/template/storage",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "StorageCtrl",
			controllerAs: 'vm'
		})
		.when('/transaction', {
			templateUrl: "/template/transaction",
			resolve: {
				'checkAuth': ['$q', 'authentication', '$location', '$rootScope', checkAuth]
			},			
			controller: "TransactionCtrl",
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