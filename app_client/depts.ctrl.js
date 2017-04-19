var DeptCtrl = function(deptService, $route){
	var vm = this;
	vm.tab = 'tab-search';
	////////////////////////////////////////////////////////
	//Setup ng-switch
	vm.toCreate = function(){
		vm.tab = 'tab-create'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
		vm.dept = vm.results[index]
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
		deptService.searchDepts(vm.searchInput)
		.then(function success(res){
			vm.results = res.data.data
		}, function error(err){
			console.log(err)
		})
	}
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewStore = function(){
		deptService.postCreateDept(vm.formData)
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
				name:vm.dept.name,
				managerFullname:vm.dept.managerFullname
			}
		}
		deptService.postSaveEdit(vm.dept._id, vm.data)
			.then(function success(res){
				console.log(res)
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('DeptCtrl', ['deptService','$route',DeptCtrl])