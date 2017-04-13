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

app.controller('CusCheckinCtrl', CusCheckinCtrl)
	.controller('CusCheckoutCtrl', CusCheckoutCtrl)
	.controller('MainCheckinCtrl', MainCheckinCtrl)
	.controller('CusEditCtrl', CusEditCtrl)