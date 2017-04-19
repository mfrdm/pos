var EmployeeCtrl = function(employeeService, $route){
	var vm = this;
	vm.tab = 'tab-search';
	////////////////////////////////////////////////////////
	//Setup ng-switch
	vm.toCreate = function(){
		vm.tab = 'tab-create'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
		vm.employee = vm.results[index]
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
		employeeService.searchEmployees(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
		}, function error(err){
			console.log(err)
		})
	}
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewEmployee = function(){
		employeeService.postCreateEmployee(vm.formData)
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
		vm.data = {
			$set:{
				firstname:vm.employee.firstname,
				lastname:vm.employee.lastname
			}
		}
		employeeService.postSaveEdit(vm.employee._id, vm.data)
			.then(function success(res){
				console.log(res)
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('EmployeeCtrl', ['employeeService','$route',EmployeeCtrl])