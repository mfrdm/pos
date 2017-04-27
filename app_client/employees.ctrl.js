var EmployeeCtrl = function(employeeService,attendanceService, $route){
	var vm = this;
	vm.tab = 'tab-main';
	vm.employeeInfo = {};
	vm.look = {};
	vm.searchResult = {};
	vm.employee = {};

	vm.employeeInfo.edu = {};
	vm.look.employeeSearchResultDiv = false;
	vm.look.fields = ['firstname', 'lastname', 'gender', 'birthday', 'phone', 'email']
	////////////////////////////////////////////////////////
	// Setup ng-switch
	vm.toMain = function(){
		vm.tab = 'tab-main'
	}
	vm.toProfile = function(index){
		vm.tab = 'tab-profile';
	}
	vm.toEdit = function(){
		vm.tab = 'tab-edit';
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.searchFunc = function(){

		employeeService.search(vm.searchInput)
		.then(function success(res){
			vm.searchResult.employees = res.data.data;
			vm.look.employeeSearchResultDiv = true;
			//Go to view one employee
			vm.selectemployeeToViewProfile = function(index){
				vm.tab = 'tab-profile';
				employeeService.readOne(vm.searchResult.employees[index]._id)
					.then(function success(res){
						vm.employee.info = res.data.data
					})
			}
		}, function error(err){
			console.log(err)
		})
	}
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewEmployee = function(){
		vm.employeeInfo.firstname = vm.firstname
		vm.employeeInfo.lastname = vm.lastname
		vm.employeeInfo.gender = vm.gender
		vm.employeeInfo.birthday = vm.birthday
		vm.employeeInfo.phone = vm.phone
		vm.employeeInfo.email = vm.email
		vm.employeeInfo.role = vm.role
		employeeService.createOne(vm.employeeInfo)
			.then(function success(res){
				console.log(res.data.data._id)
				attendanceService.createOne(
					{
						employeeId:res.data.data._id,
						firstname:res.data.data.firstname,
						lastname:res.data.data.lastname,
						email:res.data.data.email,
						phone:res.data.data.phone
					})
					.then(function success(res){
						console.log(res)
					})
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.employeeData = {}
		
		vm.look.fields.map(function(field){
			vm.employeeData[field] = vm.employee.info[field]
		})
		vm.data={
			$set:vm.employeeData
		}

		employeeService.updateOne(vm.employee.info._id, vm.data)
			.then(function success(res){
				console.log(res)
				$route.reload()
				vm.tab = 'tab-main';
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('EmployeeCtrl', ['employeeService','attendanceService','$route',EmployeeCtrl])