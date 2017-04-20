//Get data to render all current checked in customers
var CheckinCtrl = function(checkinService, $route){
	var vm = this;
	vm.tab = 'tab-search';
	vm.pageTitle = 'Home Checkin';
	vm.order = '-checkinTime'
	////////////////////////////////////////////////////////
	//Setup ng-switch
	vm.toCheckin = function(index){
		vm.tab = 'tab-checkin'
		vm.pageTitle = 'Checkin'
		vm.user = vm.results[index]
	}
	vm.toCheckout = function(index){
		vm.tab = 'tab-checkout';
		vm.pageTitle = 'Checkout'
		vm.oneOrder = vm.userList[index];
		vm.checkout;
	}
	vm.toSearch = function(){
		vm.tab = 'tab-search'
		vm.pageTitle = 'Home Checkin'
		$route.reload();
	}
	vm.toEdit = function(index){
		vm.tab = 'tab-edit';
		vm.pageTitle = 'Edit Checkin'
		vm.oneOrder = vm.userList[index];
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){
		checkinService.searchCustomers(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data

		}, function error(err){
			console.log(err)
		})
	}

	checkinService.getDataOrderCheckin()
		.then(function success(res){
			vm.userList = res.data.data
		}, function error(err){
			console.log(err)
		});
	////////////////////////////////////////////////////////
	//Checkout Page
	vm.checkout = function(){
		vm.outTime = new Date();
		checkinService.postCheckOut(vm.oneOrder._id)
			.then(function success(res){
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err);
			})
	}
	////////////////////////////////////////////////////////
	//Checkout Page
	vm.checkin = function(){
		checkinService.postCheckIn(vm.user, vm)
			.then(function success(res){
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err);
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.productList = ['Private Room', 'Group Room', 'Food', 'Drink']
	vm.saveEdit = function(){
		var newOrderLine = []
		for (var i=0; i<vm.list.length; i++){
			newOrderLine.push({productName:vm.list[i]})
		}
		console.log(newOrderLine)
		checkinService.postEdit(vm.oneOrder, newOrderLine)
			.then(function success(res){
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('CheckinCtrl', ['checkinService','$route', CheckinCtrl])