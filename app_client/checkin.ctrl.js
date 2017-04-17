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

	vm.checkOutCus = function(id){
		checkinFactory.setData(id)
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

var CusCheckoutCtrl = function(checkinService, checkinFactory, $window){
	var vm = this;
	var id = checkinFactory.getData();
	checkinService.readOneOrder(id)
		.then(function success(res){
			console.log(res)
			vm.order = res.data.user.data
			vm.outTime = new Date();
			vm.checkout = function(){
				checkinService.checkOutCustomerService(vm.order._id)
				$window.location.href = '#!/checkin';

			}
		}, function error(err){
			console.log(err)
		})

	vm.cancelCheckout = function(){
		$window.location.href = '#!/checkin';
	}


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
	.controller('CusCheckoutCtrl', ['checkinService','checkinFactory','$window',CusCheckoutCtrl])
	.controller('MainCheckinCtrl', ['checkinService','checkinFactory','$window', MainCheckinCtrl])
	.controller('CusEditCtrl', ['checkinService', CusEditCtrl])