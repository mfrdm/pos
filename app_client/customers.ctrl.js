var CusCreateCtrl = function($http){
	var vm = this;
	var data = {};
	vm.formData = {};

	vm.createNewUser = function(){
		createCustomer(vm.formData, $http)
			.then(function success(res){
				console.log(res)
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('CusCreateCtrl', CusCreateCtrl)