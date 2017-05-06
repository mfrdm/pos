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
	}
	////////////////////////////////////////////////////////
	vm.model.customer = {};//Anything about customer
	vm.model.dom = {};//Anything about DOM
	vm.model.search = {};//Anything about Search

	vm.model.customer.newCustomerData = {}//Model contain info to create new customer
	vm.model.form = {}//Anything about form data
	vm.model.sorting = {}//Model for sorting a list search result
	vm.model.form.newCustomerData = [
		{
			label:'First Name',
			type: 'text',
			model:'firstname',
			require: 'true',
			min:''
		},
		{
			label:'Middle Name',
			type: 'text',
			model:'middlename',
			require: 'false',
		},
		{
			label:'Last Name',
			type: 'text',
			model:'lastname',
			require: 'true',
		},
		{
			label:'Gender',
			model:'gender',
			require: 'true',
			options:{
				1: 'Male',
				2: 'Female',
				3: 'Others'
			}
		},
		{
			label:'Birthday',
			type: 'date',
			model:'birthday',
			require: 'true',
		},
		{
			label:'Phone',
			type: 'number',
			model:'phone',
			require: 'true',
			min: 0
		},
		{
			label:'Email',
			type: 'email',
			model:'email',
			require: 'false',
		},
		{
			label:'School/ University',
			type: 'text',
			model:'edu.school',
			require: 'true',
		},
		{
			label:'Title in School/University',
			type: 'text',
			model:'edu.title',
			require: 'true',
		},
		{
			label:'Start at University',
			type: 'date',
			model:'edu.start',
			require: 'true',
		},
		{
			label:'End at University',
			type: 'date',
			model:'edu.end',
			require: 'true',
		},
		{
			label:'Promotion Code',
			type: 'text',
			model:'promoteCode.code',
			require: 'false',
		},
	]


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
			console.log(res)
			vm.model.search.customerList = res.data.data;
			vm.model.dom.customerSearchResultDiv = true;
			//Go to view one customer
			vm.ctrl.selectCustomerToViewProfile = function(index){
				vm.tab = 'tab-profile';
				customerService.readOne(vm.model.search.customerList[index]._id)
					.then(function success(res){
						vm.model.customer.profile = res.data.data
					})
			}
		}, function error(err){
			console.log(err)
		})
	}
	
	////////////////////////////////////////////////////////
	//Create Page
	vm.ctrl.createNewCustomer = function(){
		customerService.createOne(vm.model.customer.newCustomerData)
			.then(function success(res){
				console.log(res)
				$scope.layout.currentCustomer = res.data.data;
				$window.location.href = '/#!/checkin'
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
				firstname:vm.model.customer.editProfile.firstname
			},
			$push:{
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