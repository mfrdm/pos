var CusCreateCtrl = function(customerService){
	var vm = this;
	var data = {};
	vm.formData = {};
	vm.createNewUser = function(){
		customerService.createCustomer(vm.formData)
			.then(function success(res){
				console.log(res)
			}, function error(err){
				console.log(err)
			})
	}
}

var CusSearchCtrl = function(checkinService){
	var vm = this;
	vm.searchFunc = function(){
		checkinService.searchService(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
			// vm.goToCustomer = function(id){
			// 	checkinFactory.setData(id);
			// 	$window.location.href = '#!/checkin/customer';
			// }
		}, function error(err){
			console.log(err)
		})
	}
}

app.controller('CusCreateCtrl', ['customerService',CusCreateCtrl])
	.controller('CusSearchCtrl', ['checkinService', CusSearchCtrl])