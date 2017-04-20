var CustomerCtrl = function(checkinService, customerService, $route){
	var vm = this;
	vm.tab = 'tab-search';
	////////////////////////////////////////////////////////
	//Setup ng-switch
	vm.toCreate = function(){
		vm.tab = 'tab-create'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
		vm.customer = vm.results[index]
	}
	vm.toSearch = function(){
		vm.tab = 'tab-search'
		$route.reload();
	}
	vm.toEdit = function(){
		vm.tab = 'tab-edit';
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){
		checkinService.searchCustomers(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data;
		}, function error(err){
			console.log(err)
		})
	}
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewCustomer = function(){
		customerService.postCreateCustomer(vm.formData)
			.then(function success(res){
				vm.tab = 'tab-search'
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.data={
			$set:{
				firstname:vm.customer.firstname,
				lastname:vm.customer.lastname,
				email:vm.customer.email,
				birthday:vm.customer.birthday
			}
		}
		customerService.postSaveEdit(vm.customer._id, vm.data)
			.then(function success(res){
				console.log(res)
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('CustomerCtrl', ['checkinService','customerService','$route',CustomerCtrl])