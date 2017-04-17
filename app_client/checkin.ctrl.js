//Get data to render all current checked in customers
var MainCheckinCtrl = function(checkinService, checkinFactory,$window){
	var vm = this;

	vm.searchFunc = function(){
		checkinService.searchService(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
			vm.goToCustomer = function(id){
				checkinFactory.setData(id);
				$window.location.href = '#!/checkin/customer';
			}
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
var CusCheckinCtrl = function(checkinService,checkinFactory,$window){
	var vm = this;
	var id = checkinFactory.getData();
	console.log(id);
	checkinService.readOneCusService(id)
		.then(function success(res){
			console.log(res)
			vm.user = res.data.data
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

app.controller('CusCheckinCtrl', ['checkinService','checkinFactory','$window', CusCheckinCtrl])
	.controller('CusCheckoutCtrl', ['checkinService',CusCheckoutCtrl])
	.controller('MainCheckinCtrl', ['checkinService','checkinFactory','$window', MainCheckinCtrl])
	.controller('CusEditCtrl', ['checkinService', CusEditCtrl])