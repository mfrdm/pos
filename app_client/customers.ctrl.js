var CustomerCtrl = function($scope, customerService, $route, $window){
	var vm = this;

	vm.tab = 'tab-main';
	////////////////////////////////////////////////////////
	vm.model = {};
	vm.ctrl = {};

	////////////////////////////////////////////////////////
	// Setup ng-switch
	vm.ctrl.toMain = function(){
		vm.tab = 'tab-main'
	}
	vm.ctrl.toProfile = function(index){
		vm.tab = 'tab-profile';

	}
	vm.ctrl.toEdit = function(index){
		vm.tab = 'tab-edit';
		vm.model.customer.editProfile = angular.copy(vm.model.customer.profile)
		vm.model.customer.editProfile.phone.map(function(ele){
			ele =  parseInt(ele)
		})
		// vm.model.customer.editProfile.edu.title = vm.model.customer.selectCustomerTitleConvert[vm.model.customer.profile.edu[0].title];
	}
	////////////////////////////////////////////////////////
	vm.model.customer = {};//Anything about customer
	vm.model.dom = {};//Anything about DOM
	vm.model.search = {};//Anything about Search
	vm.model.input = {};//input field model for start and end of school

	vm.model.customer.selectCustomerTitleConvert = {
		1: 'Undergraduate',
		2: 'Graduate',
		3: 'Doctorate'
	}

	vm.model.customer.newCustomerData = {}//Model contain info to create new customer
	vm.model.form = {}//Anything about form data
	vm.model.sorting = {}//Model for sorting a list search result

	vm.model.dom.customerSearchResultDiv = false;
	vm.model.dom.CreateCustomerDiv = false;

	////////////////////////////////////////////////////////
	//Toggle Div
	vm.ctrl.toggleCreateCustomerDiv = function(){
		if (!vm.model.dom.CreateCustomerDiv) vm.model.dom.CreateCustomerDiv = true;
			else vm.model.dom.CreateCustomerDiv = false;
	}
	////////////////////////////////////////////////////////
	//Search Page
	vm.ctrl.searchFunc = function(){

		customerService.search(vm.model.search.input)
		.then(function success(res){
			vm.model.search.customerList = res.data.data;
			vm.model.dom.customerSearchResultDiv = true;
			//Go to view one customer
			vm.ctrl.selectCustomerToViewProfile = function(index){
				vm.tab = 'tab-profile';
				customerService.readOne(vm.model.search.customerList[index]._id)
					.then(function success(res){
						vm.model.customer.profile = res.data.data
						console.log(vm.model.customer.profile)
					})
			}
		}, function error(err){
			console.log(err)
		})
	}
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.ctrl.createNewCustomer = function(){
		// vm.model.customer.newCustomerData.edu.start = new Date(vm.model.input.start, 0,1)
		// vm.model.customer.newCustomerData.edu.end = new Date(vm.model.input.end, 0,1)
		vm.model.customer.newCustomerData.birthday = new Date(vm.model.input.year+'.'+vm.model.input.month+'.'+vm.model.input.day)
		console.log(vm.model.customer.newCustomerData)
		customerService.createOne(vm.model.customer.newCustomerData)
			.then(function success(res){
				if(res.status == 201){
					$window.alert('Create new customer successfully')
					$scope.layout.currentCustomer = res.data.data;
					console.log($scope.layout.currentCustomer)
					$window.location.href = '/#!/checkin'
				}else{
					$window.alert('Failed when creating new customer, please check')
				}
				
			}, function error(err){
				console.log(err)
			})
	}
	////////////////////////////////////////////////////////
	//Edit Page
	vm.ctrl.saveEdit = function(){
		var data={
			$set:{
				lastname:vm.model.customer.editProfile.lastname,
				middlename:vm.model.customer.editProfile.lastname,
				firstname:vm.model.customer.editProfile.firstname,
				edu:{
					school: vm.model.customer.editProfile.edu[0].school
				},
				email:vm.model.customer.editProfile.email[0],
				phone: vm.model.customer.editProfile.phone[0]
			}
		}

		console.log(data)

		customerService.updateOne(vm.model.customer.editProfile._id, data)
			.then(function success(res){
				console.log(res)
				$route.reload()
				vm.tab = 'tab-main';
			}, function error(err){
				console.log(err)
			})
	}
}

app.controller('CustomerCtrl', ['$scope', 'customerService','$route','$window',CustomerCtrl])