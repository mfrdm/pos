var AttendanceCtrl = function(attendanceService, $route, $filter){
	var vm = this;
	vm.tab = 'tab-main';
	vm.attendanceInfo = {};
	vm.look = {};
	vm.searchResult = {};
	vm.attendance = {};
	vm.searchResultEmployees = {};

	vm.attendanceInfo.edu = {};
	vm.look.attendanceSearchResultDiv = false;
	vm.look.selectEmployeeResultDiv = false;
	vm.look.fields = ['name', 'price', 'category']

	vm.selectedEmployeeId = ''
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
	//Search Employee for create new Attendance
	vm.searchEmployees = function(){
		attendanceService.search(vm.searchInputEmployee)
		.then(function success(res){
			vm.searchResultEmployees.employees = res.data.data;
			vm.look.selectEmployeeResultDiv = true;
			//Go to view one attendance
			vm.selectEmployeeToGetData = function(index){
				vm.searchInputEmployee = vm.searchResultEmployees.employees[index].firstname +' '+ vm.searchResultEmployees.employees[index].lastname
				vm.selectedEmployeeId = vm.searchResultEmployees.employees[index]._id
				vm.look.selectEmployeeResultDiv = false;
			}
		}, function error(err){
			console.log(err)
		})
	}
	////////////////////////////////////////////////////////
	//Search Page
	// vm.searchFunc = function(){

	// 	attendanceService.search(vm.searchInput)
	// 	.then(function success(res){
	// 		vm.searchResult.attendances = res.data.data;
	// 		vm.look.attendanceSearchResultDiv = true;
	// 		//Go to view one attendance
	// 		vm.selectattendanceToViewProfile = function(index){
	// 			vm.tab = 'tab-profile';
	// 			attendanceService.readOne(vm.searchResult.attendances[index]._id)
	// 				.then(function success(res){
	// 					vm.attendance.info = res.data.data
	// 				})
	// 		}
	// 	}, function error(err){
	// 		console.log(err)
	// 	})
	// }
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.updateNewAttendance = function(){
		vm.attendanceInfo.id = vm.selectedEmployeeId
		vm.attendanceInfo.startTime = vm.start
		vm.attendanceInfo.endTime = vm.end
		console.log($filter('date')(vm.attendanceInfo.startTime,'yyyy-MM-dd HH:mm:ss Z'));
		// console.log(vm.attendanceInfo)
		var data = {
			'$push':{
				'workingTime':{
					'startTime':vm.attendanceInfo.startTime,
					'endTime':vm.attendanceInfo.endTime
				}
			}
		}
		attendanceService.updateOne(vm.attendanceInfo.id, data)
			.then(function success(res){
				console.log(res)
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.attendanceData = {}
		
		vm.look.fields.map(function(field){
			vm.attendanceData[field] = vm.attendance.info[field]
		})
		vm.data={
			$set:vm.attendanceData
		}

		attendanceService.updateOne(vm.attendance.info._id, vm.data)
			.then(function success(res){
				console.log(res)
				$route.reload()
				vm.tab = 'tab-main';
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('AttendanceCtrl', ['attendanceService','$route','$filter',AttendanceCtrl])