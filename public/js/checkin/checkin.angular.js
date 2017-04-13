var app = angular.module('checkinApp', ['ngRoute']);

app.config(["$routeProvider",function($routeProvider) {
	$routeProvider
		.when("/", {
			templateUrl : "/angular/readMainCheckin",
			controller:"MainCheckinCtrl",
			controllerAs:"vm"
		})
		.when("/customer", {
			templateUrl : "/angular/readOneCusCheckin",
			controller:"CusCheckinCtrl",
			controllerAs:'vm'
		})
		.when("/checkout", {
			templateUrl : "/angular/readOneCusCheckout",
			controller:"CusCheckoutCtrl",
			controllerAs:'vm'
		})
		.when("/edit", {
			templateUrl : "/angular/readOneCusEdit",
			controller:"CusEditCtrl",
			controllerAs:'vm'
		})
		.otherwise({
			redirect:'/'
		});
	// $locationProvider.html5Mode(true);
}]);

var MainCheckinCtrl = function(readCheckinService){
	var vm = this;
	readCheckinService
		.then(function success(res){
			vm.userList = res.data.user.data
		}, function error(err){
			console.log(err)
		});
}

var CusCheckinCtrl = function(readOneCusService, $http){
	var vm = this;
	readOneCusService
		.then(function success(res){
			vm.user = res.data.user.data
			vm.checkin = function(){
				checkInService(vm.user, vm, $http)
				.then(function success(res){
					console.log(res)
				}, function error(err){
					console.log(err)
				});
			}
		}, function error(err){
			console.log(err)
		})
}

var CusCheckoutCtrl = function(readOneOrder){
	var vm = this;
	readOneOrder
		.then(function success(res){
			vm.order = res.data.user.data
			vm.outTime = new Date();
		}, function error(err){
			console.log(err)
		})
}

var CusEditCtrl = function(readOneOrder){
	var vm = this;
	readOneOrder
		.then(function success(res){
			vm.order = res.data.user.data
		}, function error(err){
			console.log(err)
		})
}

var readCheckinService = function($http){
	return $http({
		method:'GET',
		url:'/angular/readSomeCusCheckin'
	})
}

var readOneCusService = function($http){
	return $http({
		method:'GET',
		url:'/customers/customer/58eb474538671b4224745192'
	})
}

var readOneOrder = function($http){
	return $http({
		method:'GET',
		url:'/checkout/invoice/58eee6800de4f5161f50afdf'
	})
}

var checkInService = function(user, vm, $http){
	return $http({
			method:'POST',
			url:'/checkin/'+user._id,
			data: JSON.stringify({
				total: 1,
				orderline: [
					{
						productName: vm.ordername
					}
				],
				customers:{
					customerId: user._id,
					firstname: user.firstname,
					lastname: user.lastname
				},
				storeId: "58eb474538671b4224745192",
				staffId: "58eb474538671b4224745192",	
				updateAt: {
					time: new Date('09/15/2017')
				}
			})
		})
}

app.controller('CusCheckinCtrl', CusCheckinCtrl)
	.controller('CusCheckoutCtrl', CusCheckoutCtrl)
	.controller('MainCheckinCtrl', MainCheckinCtrl)
	.controller('CusEditCtrl', CusEditCtrl)
	.service('readCheckinService', readCheckinService)
	.service('readOneCusService', readOneCusService)
	.service('checkInService', checkInService)
	.service('readOneOrder', readOneOrder)