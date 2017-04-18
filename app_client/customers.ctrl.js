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

var CusSearchCtrl = function(checkinService, checkinFactory, $window){
	var vm = this;
	vm.searchFunc = function(){
		checkinService.searchService(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
			vm.goToCustomer = function(id){
				checkinFactory.setData(id);
				$window.location.href = '#!/customers/profile';
			}
		}, function error(err){
			console.log(err)
		})
	}
}

var CusProfileCtrl = function(checkinService, checkinFactory){
	var vm = this;
	var id = checkinFactory.getData();
	checkinService.readOneCusService(id)
		.then(function success(res){
			vm.user = res.data.data
			//When click checkin, will check in for customer
		}, function error(err){
			console.log(err)
		})
}

var CusEditCtrl = function(checkinService, checkinFactory){
	var vm = this;


}

app.controller('CusCreateCtrl', ['customerService',CusCreateCtrl])
	.controller('CusSearchCtrl', ['checkinService', 'checkinFactory','$window',CusSearchCtrl])
	.controller('CusProfileCtrl', ['checkinService','checkinFactory',CusProfileCtrl])
	.controller('CusEditCtrl', [CusEditCtrl])