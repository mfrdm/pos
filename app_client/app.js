var app = angular.module ('posApp', ['ngRoute']);

function config ($routeProvider){
	$routeProvider
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
		.when("/customers/edit", {
			templateUrl: "/angular/readEditCustomer",
			controller: "CusEditCtrl",
			controllerAs: 'vm'
		})
		.when("/attendance", {
			templateUrl: "/angular/attendance",
			controller: "AttendanceCtrl",
			controllerAs: 'vm'
		})
		.when("/depts/profile", {
			templateUrl: "/angular/depts/profile",
			controller: "DeptProfileCtrl",
			controllerAs: 'vm'
		})
		.when("/depts/all", {
			templateUrl: "/angular/depts/all",
			controller: "DeptProfileCtrl",
			controllerAs: 'vm'
		})
		.when("/depts/create", {
			templateUrl: "/angular/depts/create",
			controller: "DeptCreateCtrl",
			controllerAs: 'vm'
		})
		.when("/depts/edit", {
			templateUrl: "/angular/depts/edit",
			controller: "DeptEditCtrl",
			controllerAs: 'vm'
		})
		.when("/products/profile", {
			templateUrl: "/angular/produtcs/profile",
			controller: "ProductProfileCtrl",
			controllerAs: 'vm'
		})
		.when("/products/search", {
			templateUrl: "/angular/produtcs/search",
			controller: "ProductSearchCtrl",
			controllerAs: 'vm'
		})
		.when("/products/create", {
			templateUrl: "/angular/produtcs/create",
			controller: "ProductCreateCtrl",
			controllerAs: 'vm'
		})
		.when("/products/edit", {
			templateUrl: "/angular/produtcs/edit",
			controller: "ProductEditCtrl",
			controllerAs: 'vm'
		})
		.otherwise ({redirectTo: '/'});
};

// FIX later
// Check if a user has permission to access a certain page or resource
function checkPermission ($q) {
	return $q.defer ()
}

app
	.config (['$routeProvider', config])	
	.run(function($rootScope) {
	    $rootScope.$on('$viewContentLoaded', function () {
	        $(document).foundation();
	    });
	})
