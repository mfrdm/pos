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
			vm.userList = res.data.user.data
			vm.goToEdit = function(index){
				checkinFactory.setData(vm.userList[index]._id)
			}
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
			vm.order = res.data.user.data
			vm.outTime = new Date();
			vm.checkout = function(){
				checkinService.checkOutCustomerService(vm.order._id);

				$window.location.href = '#!/checkin';
			}
		}, function error(err){
			console.log(err)
		})

	vm.cancelCheckout = function(){
		$window.location.href = '#!/checkin';
	}


}

var CusEditCtrl = function(checkinService, checkinFactory){
	var vm = this;
	var id = checkinFactory.getData();
	valueArr = ['Private Room', 'Group Room', 'Soft Drink', 'Food']
	
	vm.checkboxModel1 = {value:false}
	vm.checkboxModel2 = {value:false}
	vm.checkboxModel3 = {value:false}
	vm.checkboxModel4 = {value:false}
	
	vm.saveEdit = function(){
		var checkboxArr = [vm.checkboxModel1.value, vm.checkboxModel2.value, vm.checkboxModel3.value, vm.checkboxModel4.value]
		console.log(checkboxArr)
		for (var i=0; i<4; i++){
			if(checkboxArr[i]==true){
				console.log(valueArr[i])
			}
		}
	}
	// checkinService.readOneOrder(id)
	// 	.then(function success(res){
	// 		console.log(res)
	// 		vm.order = res.data.user.data
	// 		vm.saveEdit = function(){
	// 			console.log(vm.products, vm.checkInDate, vm.checkInTime)
	// 		}
	// 	}, function error(err){
	// 		console.log(err)
	// 	})
}

app.controller('CusCheckinCtrl', ['checkinService','checkinFactory','$window', CusCheckinCtrl])
	.controller('CusCheckoutCtrl', ['checkinService','checkinFactory','$window',CusCheckoutCtrl])
	.controller('MainCheckinCtrl', ['checkinService','checkinFactory','$window', MainCheckinCtrl])
	.controller('CusEditCtrl', ['checkinService','checkinFactory', CusEditCtrl])