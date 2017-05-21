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
	vm.model.dom = {
		lang:{},
		confirmCreateDiv:false
	};//Anything about DOM
	vm.model.search = {};//Anything about Search
	vm.model.input = {};//input field model for start and end of school

	//Translate
	vm.model.dom.lang.en = {
		jobStudent:'Undergraduate',
		jobGraduate:'Graduate',
		jobDoc:'Doctorate'
	}

	vm.model.dom.lang.vi = {
		jobStudent:'Sinh viên',
		jobGraduate:'Đã tốt nghiệp',
		jobDoc:'Thạc sĩ'
	}

	//Schools
	vm.model.customer.selectSchools = [
		'Đại học Bách khoa',
		'Đại học Hà Nội',
		'Đại học sư phạm',
		'Đại học văn hóa',
		'Đại học Giao thông',
		'Học viện báo chí và tuyên truyền',
		'Học viện hành chính',
		'Học viện ngân hàng',
		'Học viện nông nghiệp',
		'Học viện quân y',
		'Học viện tài chính',
		'Học viện thanh thiếu niên',
		'Đại học Khoa học tự nhiên',
		'Đại học Kinh tế quốc dân',
		'Đại học Luật',
		'Đại học Mỏ địa chất',
		'Đại học Ngoại giao',
		'Đại học Ngoại thương',
		'Đại học Quốc gia',
		'Đại học Thương mại',
		'Đại học Xây dựng',
		'Đại học FTU',
	]

	vm.model.customer.genders = {
		1: 'Male',
		2: 'Female',
		3: 'Others'
	}

	vm.model.dom.lang.using = vm.model.dom.lang.vi

	vm.model.customer.selectCustomerTitleConvert = {
		1: vm.model.dom.lang.using.jobStudent,
		2: vm.model.dom.lang.using.jobGraduate,
		3: vm.model.dom.lang.using.jobDoc
	}



	vm.model.newCustomer = {}//Model contain info to create new customer
	vm.model.newCustomer.edu = {}
	vm.model.newCustomer.phone = [];
	vm.model.newCustomer.email = [];
	vm.model.form = {}//Anything about form data
	vm.model.sorting = {}//Model for sorting a list search result

	vm.model.dom.customerSearchResultDiv = false;
	vm.model.dom.CreateCustomerDiv = true;

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
	vm.ctrl.confirmCreateNewCustomer = function(){

		if(vm.model.customer.otherSchool){
			vm.model.newCustomer.edu.school = vm.model.customer.otherSchool
		}
		
		vm.model.dom.confirmCreateDiv = true;
	}

	vm.ctrl.createNewCustomer = function(){


		vm.model.newCustomer.fullname = vm.model.newCustomer.lastname.trim () + ' ' + (vm.model.newCustomer.middlename ? vm.model.newCustomer.middlename.trim() + ' ' : '') + vm.model.newCustomer.firstname.trim ();
		vm.model.newCustomer.fullname = vm.model.newCustomer.fullname.toUpperCase ();

		customerService.createOne(vm.model.newCustomer)
			.then(function success(res){
				if(res.status == 200){
					$('#announceCreateSuccessfull').foundation('open')
					$scope.layout.currentCustomer = res.data.data;
					$window.location.href = '/#!/checkin'
				}else{
					$('#announceCreateFail').foundation('open')
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

	vm.ctrl.reset = function(){
		$window.location.reload();
	}
}

app.controller('CustomerCtrl', ['$scope', 'customerService','$route','$window',CustomerCtrl])