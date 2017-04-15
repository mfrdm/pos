//Get data to render all current checked in customers
var MainCheckinCtrl = function(readCheckinService){
	var vm = this;
	readCheckinService
		.then(function success(res){
			vm.userList = res.data.user.data
		}, function error(err){
			console.log(err)
		});
}

//Get data of one customer who we want to check in for
var CusCheckinCtrl = function(readOneCusService, $http, $window){
	var vm = this;
	readOneCusService
		.then(function success(res){
			vm.user = res.data.user.data
			//When click checkin, will check in for customer
			vm.checkin = function(){
				checkInService(vm.user, vm, $http)
				.then(function success(res){
					$window.location.href = '#!/checkin';
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

app.controller('CusCheckinCtrl', CusCheckinCtrl)
	.controller('CusCheckoutCtrl', CusCheckoutCtrl)
	.controller('MainCheckinCtrl', MainCheckinCtrl)
	.controller('CusEditCtrl', CusEditCtrl)