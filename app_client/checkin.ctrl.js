//Get data to render all current checked in customers
var MainCheckinCtrl = function(checkinService){
	var vm = this;

	vm.searchFunc = function(){
		checkinService.searchService(vm.searchInput)
		.then(function success(res){
			console.log(res)
		}, function error(err){
			console.log(err)
		})
	}
	checkinService.readCheckinService()
		.then(function success(res){
			console.log(res)
			vm.userList = res.data.user.data
		}, function error(err){
			console.log(err)
		});
}

//Get data of one customer who we want to check in for
var CusCheckinCtrl = function(checkinService, $window){
	var vm = this;

	checkinService.readOneCusService()
		.then(function success(res){
			vm.user = res.data.user.data
			//When click checkin, will check in for customer
			vm.checkin = function(){
				checkinService.checkInCustomerService(vm.user, vm)
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

var CusCheckoutCtrl = function(checkinService){
	var vm = this;
	checkinService.readOneOrder()
		.then(function success(res){
			vm.order = res.data.user.data
			vm.outTime = new Date();
		}, function error(err){
			console.log(err)
		})
}

var CusEditCtrl = function(checkinService){
	var vm = this;
	checkinService.readOneOrder()
		.then(function success(res){
			vm.order = res.data.user.data
		}, function error(err){
			console.log(err)
		})
}

app.controller('CusCheckinCtrl', ['checkinService', '$window', CusCheckinCtrl])
	.controller('CusCheckoutCtrl', ['checkinService',CusCheckoutCtrl])
	.controller('MainCheckinCtrl', ['checkinService', MainCheckinCtrl])
	.controller('CusEditCtrl', ['checkinService', CusEditCtrl])