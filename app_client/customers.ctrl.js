var CustomerCtrl = function(customerService, $route){
	var vm = this;
	vm.tab = 'tab-main';
	vm.customerInfo = {};
	vm.look = {};
	vm.searchResult = {};
	vm.customer = {};

	vm.customerInfo.edu = {};
	vm.look.customerSearchResultDiv = false;
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

		customerService.search(vm.searchInput)
		.then(function success(res){
			vm.searchResult.customers = res.data.data;
			vm.look.customerSearchResultDiv = true;
			//Go to view one customer
			vm.selectCustomerToViewProfile = function(index){
				vm.tab = 'tab-profile';
				customerService.readOne(vm.searchResult.customers[index]._id)
					.then(function success(res){
						vm.customer.info = res.data.data
					})
			}
		}, function error(err){
			console.log(err)
		})
	}
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.createNewCustomer = function(){
		vm.customerInfo.firstname = vm.firstname
		vm.customerInfo.lastname = vm.lastname
		vm.customerInfo.gender = vm.gender
		vm.customerInfo.birthday = vm.birthday
		vm.customerInfo.phone = vm.phone
		vm.customerInfo.email = vm.email
		vm.customerInfo.edu.school = vm.school
		vm.customerInfo.edu.title = vm.title
		vm.customerInfo.edu.start = vm.start
		vm.customerInfo.edu.end = vm.end
		customerService.createOne(vm.customerInfo)
			.then(function success(res){
				console.log(res)
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.saveEdit = function(){
		vm.customerData = {}
		
		vm.look.fields.map(function(field){
			vm.customerData[field] = vm.customer.info[field]
		})
		vm.data={
			$set:vm.customerData
		}

		customerService.updateOne(vm.customer.info._id, vm.data)
			.then(function success(res){
				console.log(res)
				$route.reload()
				vm.tab = 'tab-main';
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('CustomerCtrl', ['customerService','$route',CustomerCtrl])