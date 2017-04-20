var CheckoutCtrl = function(checkoutService, $route){
	var vm = this;
	vm.pageTitle = 'Home Checkout'
	checkoutService.getDataOrderCheckout()
		.then(function success(res){
			console.log(res)
			vm.userList = res.data.data
		}, function error(err){
			console.log(err)
		})
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){
		checkoutService.searchCustomers(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
		}, function error(err){
			console.log(err)
		})
	}
}

app.controller('CheckoutCtrl', ['checkoutService','$route',CheckoutCtrl])