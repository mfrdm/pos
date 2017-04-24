var app = angular.module ('posApp', ['ngRoute', "checklist-model"]);

app
	.config (['$routeProvider', config])
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $("#mainContentDiv").foundation(); // initialize elements in ng-view
	    });
	})
	.controller ('LayoutCtrl', ['$scope', '$location', LayoutCtrl])	


function config ($routeProvider){
	$routeProvider
		.when ('/login', {
			templateUrl: '/login',
			resolve: {
				'checkPermission': ['$q', 'authentication', checkPermission]
			},			
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
			resolve: {
				'checkPermission': ['$q', 'authentication', checkPermission]
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
		.otherwise ({redirectTo: '/login'});
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

function LayoutCtrl ($scope, $location) {
	$scope.layout = {};
	$scope.layout.loginBtn = true;
	$scope.layout.customerNumber = 100; // TESTING
	$scope.layout.bookingNumber = 20; // TESTING
	$scope.layout.parkingLotNumber = 15; // TESTING
	$scope.layout.today = new Date ();

	$scope.layout.updateAfterLogin = function (storeName) {
		if (!storeName)
			storeName = 'Green Space Chua Lang 82/70';
		$scope.layout.storeName = storeName;
		$scope.layout.accountBtn = true;
		$scope.layout.notiBtn = true;
		$scope.layout.sideBarMenu = true;
		$scope.layout.sideBarMenu = true;
		$scope.layout.commonStatisticBar = true;
		$scope.layout.loginBtn = false;
	};

	$scope.layout.updateMessage = function (message, mode) {
		$scope.layout.message = message;
		$scope.layout.messageMode = mode;
		$scope.layout.messageDiv = true;
	};

	$scope.layout.closeMessageDiv = function (){
		$scope.layout.messageDiv = false;
	}

	$("body").foundation();

	// check authentication
	// TESTING: always false
	if (true) {
		$location.path ('/login');
	};
}