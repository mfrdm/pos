(function (){
	angular.module('posApp')
		.controller('NewCustomersCtrl', ['DataPassingService', 'CustomerService', '$scope', '$window','$route', '$location', NewCustomersCtrl])

	function NewCustomersCtrl (DataPassingService, CustomerService, $scope, $window, $route, $location){
		var LayoutCtrl = DataPassingService.get ('layout');
		var vm = this;

		vm.model = {
			register: {
				edu: {
					title:'',
					school: '',
				},
				firstname:'',
				lastname: '',
				middlename: '',
				gender: '',
				birthday: '',
				email: '',
				phone: '',
				storeId: LayoutCtrl.model.dept._id,
				staffId: LayoutCtrl.model.user._id,
			},
			customerList:[],
			dom:{
				register: {
					confirmDiv: false,
					registerDiv: false,
					existedCustomerDiv:false,
					customerExistResultDiv: false,
				},
				customerSearchResultDiv: false,
				data:{},
				search:{
					message:{}
				},
				customer:{
					info:false
				}
			},
			search: {
				register: {
					customers: [],
				}
			},
			temporary: {
				register: {
				}
			},
			existedCustomer:{
				customers:[]
			},
			customer:{}
		};

		vm.ctrl = {
			register: {}
		};

		vm.model.dom.data.eng = {
			title:'Customer List',
			register: {
				search:{
					list:{
						number:'No',
						fullname:'Họ và tên',
						birthday:'Sinh nhật',
						email:'Email',
						phone:'Điện thoại'
					}
				},				
				gender: [
					{value: 1, label: 'Male'},
					{value: 2, label: 'Female'},
					{value: 3, label: 'Other'},
				],
				schools: [
				 	{'label':'Đại học Bách khoa','value':1},
				    {'label':'Đại học Hà Nội','value':2},
				    {'label':'Đại học sư phạm','value':3},
				    {'label':'Đại học văn hóa','value':4},
				    {'label':'Đại học Giao thông','value':5},
				    {'label':'Học viện báo chí và tuyên truyền','value':6},
				    {'label':'Học viện hành chính','value':7},
				    {'label':'Học viện ngân hàng','value':8},
				    {'label':'Học viện nông nghiệp','value':9},
				    {'label':'Học viện quân y','value':10},
				    {'label':'Học viện tài chính','value':11},
				    {'label':'Học viện thanh thiếu niên','value':12},
				    {'label':'Đại học Khoa học tự nhiên','value':13},
				    {'label':'Đại học Kinh tế quốc dân','value':14},
				    {'label':'Đại học Luật','value':15},
				    {'label':'Đại học Mỏ địa chất','value':16},
				    {'label':'Học viện Ngoại giao','value':17},
				    {'label':'Đại học Ngoại thương','value':18}, // SPECIAL
				    {'label':'Đại học Quốc gia','value':19},
				    {'label':'Đại học Thương mại','value':20},
				    {'label':'Đại học Xây dựng','value':21},
				    {'label':'Đại học FPT','value':22},
				    {'label':'Đại học Ngoại Ngữ','value':23},
				    {'label':'Đại học Y học cổ truyền','value':24},
				    {'label':'Đại học Tài nguyên môi trường','value':25},
				    {'label':'Đại học Y Hà Nội', 'value':26},
				    {'label':'Đại học Nội Vụ', 'value':27},
				    {'label':'Học viện chính sách và phát triển', 'value':28},
				    {'label':'Đại học Thăng Long', 'value':29},
				    {'label':'Đại học Thương Mại', 'value':30},
				    {'label':'Đại học kinh doanh công nghệ', 'value':31},
				    {'label':'Viện đại học mở', 'value':32},
				    {'label':'Trường khác', 'value': -1},
				],
				customer:{
					lastname:'Lastname',
					middlename:'Middlename',
					firstname:'Firstname',
					gender:'Gender',
					birthday:'Birthday',
					email:'Email',
					phone:'Phone',
					school:'School'
				}			
			}
		}

		vm.model.dom.data.vn = {
			title:'Customer List',
			register: {
				search:{
					list:{
						number:'No',
						fullname:'Họ và tên',
						birthday:'Sinh nhật',
						email:'Email',
						phone:'Điện thoại'
					}
				},				
				genders: [
					{value: 1, label: 'Nam'},
					{value: 2, label: 'Nữ'},
					{value: 3, label: 'Khác'},
				],
				schools: [
				 	{'label':'Đại học Bách khoa','value':1},
				    {'label':'Đại học Hà Nội','value':2},
				    {'label':'Đại học sư phạm','value':3},
				    {'label':'Đại học văn hóa','value':4},
				    {'label':'Đại học Giao thông','value':5},
				    {'label':'Học viện báo chí và tuyên truyền','value':6},
				    {'label':'Học viện hành chính','value':7},
				    {'label':'Học viện ngân hàng','value':8},
				    {'label':'Học viện nông nghiệp','value':9},
				    {'label':'Học viện quân y','value':10},
				    {'label':'Học viện tài chính','value':11},
				    {'label':'Học viện thanh thiếu niên','value':12},
				    {'label':'Đại học Khoa học tự nhiên','value':13},
				    {'label':'Đại học Kinh tế quốc dân','value':14},
				    {'label':'Đại học Luật','value':15},
				    {'label':'Đại học Mỏ địa chất','value':16},
				    {'label':'Học viện Ngoại giao','value':17},
				    {'label':'Đại học Ngoại thương','value':18},
				    {'label':'Đại học Quốc gia','value':19},
				    {'label':'Đại học Thương mại','value':20},
				    {'label':'Đại học Xây dựng','value':21},
				    {'label':'Đại học FPT','value':22},
				    {'label':'Đại học Ngoại Ngữ','value':23},
				    {'label':'Đại học Y học cổ truyền','value':24},
				    {'label':'Đại học Tài nguyên môi trường','value':25},
				    {'label':'Đại học Y Hà Nội', 'value':26},
				    {'label':'Đại học Nội Vụ', 'value':27},
				    {'label':'Học viện chính sách và phát triển', 'value':28},
				    {'label':'Đại học Thăng Long', 'value':29},
				    {'label':'Đại học Thương Mại', 'value':30},
				    {'label':'Đại học kinh doanh công nghệ', 'value':31},
				    {'label':'Trường khác', 'value': -1},
				],
				customer:{
					lastname:'Họ',
					middlename:'Tên đệm',
					firstname:'Tên',
					gender:'Giới tính',
					birthday:'Ngày sinh',
					email:'Email',
					phone:'Phone',
					school:'Trường',
					selectSchool:'Chọn Trường'
				},
				existedCustomer:{
					number:'No',
					fullname:'Tên',
					birthday:'Ngày sinh',
					email:'Email',
					phone:'Điện thoại'
				}
			},
			search:{
				label:{
					username:'Tên/Điện thoại/Email'
				},
				placeholder:{
					username: 'Tên/Điện thoại/Email'
				},
				message:{
					notFound:'Không có kết quả'
				}
			}
		}

		vm.model.dom.data.selected = {};

		vm.model.dom.data.selected = vm.model.dom.data.vn

		// Search
		vm.ctrl.searchCustomer =  function (){
			vm.ctrl.showLoader ();
			CustomerService.readCustomers (vm.model.search.username).then(
				function success (res){
					vm.ctrl.hideLoader ();
					if (!res.data){
						// unexpected result. should never exist
					}
					else{
						if (res.data.data.length){
							vm.model.search.customers = res.data.data;
							vm.model.dom.search.message.notFound = false;
							vm.model.dom.customerSearchResult = true;
						}
						else{
							vm.model.dom.search.message.notFound = true;
							vm.model.dom.customerSearchResult = false;
						}
					}
				}, 
				function error (err){
					vm.ctrl.hideLoader ();
					console.log(err)
				}
			);
		};

		vm.ctrl.clearSearchInput = function(){
			if(!vm.model.search.username){
				if(vm.model.customer){
					vm.model.customer = {};
				}
				vm.ctrl.resetSearchCustomerDiv()
				vm.model.dom.search.message.notFound = false
			}
		}

		vm.ctrl.selectCustomer = function (index){
			vm.model.customer = vm.model.search.customers [index]

			if (vm.model.search.customers [index].checkinStatus){
				vm.model.occupancyId = vm.model.search.customers [index].occupancy.pop ();
			}

			vm.ctrl.resetSearchCustomerDiv ();

			vm.model.dom.customer.info = true;
		};

		vm.ctrl.resetSearchCustomerDiv = function (){
			vm.model.dom.customerSearchResult = false;
			vm.model.search.customers = [];
		};

		vm.ctrl.toggleRegisterDiv = function(){
			if (!vm.model.dom.register.registerDiv) {
				vm.model.dom.register.registerDiv = true;
			}
			
			else vm.model.dom.register.registerDiv = false;
		}

		vm.ctrl.register.getSchoolLabel	= function (){
			vm.model.dom.data.selected.register.schools.map (function (x, i, arr){
				if (x.value == vm.model.register.edu.school){
					vm.model.temporary.register.schoolLabel = x.label;
				}
			});
		}	

		vm.ctrl.register.getGenderLabel = function (){
			vm.model.dom.data.selected.register.genders.map (function (x, i, arr){
				if (x.value == vm.model.register.gender){
					vm.model.temporary.register.genderLabel = x.label;
				}				
			});
		}

		vm.ctrl.register.sanatizeRawData = function (){
			// trim
			vm.model.register.firstname = vm.model.register.firstname ? vm.model.register.firstname.trim () : vm.model.register.firstname;
			vm.model.register.lastname = vm.model.register.lastname ? vm.model.register.lastname.trim () : vm.model.register.lastname;
			vm.model.register.middlename = vm.model.register.middlename ? vm.model.register.middlename.trim () : vm.model.register.middlename;
			vm.model.temporary.register.otherSchool = vm.model.temporary.register.otherSchool ? vm.model.temporary.register.otherSchool.trim () : vm.model.temporary.register.otherSchool;
			vm.model.register.email = vm.model.register.email ? vm.model.register.email.trim() : vm.model.register.email;
			vm.model.register.phone = vm.model.register.phone ? vm.model.register.phone.trim() : vm.model.register.phone;

			// upper case first letter of name
			function upperCaseFirstLetter (s){
				sArr = s.split ('');
				sArr[0] = sArr[0].toUpperCase ();
				return sArr.join ('');
			}

			vm.model.register.firstname = upperCaseFirstLetter (vm.model.register.firstname);
			vm.model.register.lastname = upperCaseFirstLetter (vm.model.register.lastname);
			vm.model.register.middlename = vm.model.register.middlename ? upperCaseFirstLetter (vm.model.register.middlename) : '';
		
			vm.model.register.email = vm.model.register.email ? vm.model.register.email.toLowerCase () : vm.model.register.email;

			if(vm.model.temporary.register.otherSchool){
				vm.model.register.edu.school = vm.model.temporary.register.otherSchool; 
			}

			// Add full name
			vm.model.register.fullname = vm.model.register.lastname + ' ' + (vm.model.register.middlename ? vm.model.register.middlename + ' ' : '') + vm.model.register.firstname;
			vm.model.register.fullname = vm.model.register.fullname.toUpperCase ();

			// set student status
			vm.model.register.isStudent = vm.model.register.edu.school ? true : false;
		}

		vm.ctrl.register.confirm = function(){
			// vm.ctrl.register.sanatizeRawData (vm.model.register);	
			vm.ctrl.register.showConfirm ();
		};

		vm.ctrl.register.checkExist = function (){
			// when display registered customers with similar info but forgo all of them and want to register
			if (vm.model.dom.register.customerExistResultDiv){
				vm.ctrl.register.confirm ();
				return
			}

			vm.ctrl.showLoader ();
			vm.ctrl.register.sanatizeRawData (vm.model.register);

			CustomerService.checkExist (vm.model.register).then(
				function success (res){
					vm.ctrl.hideLoader ();
					if (res.data.data.length){
						// show list of potential customer accounts
						vm.model.search.register.customers = res.data.data;
						vm.model.dom.register.customerExistResultDiv = true;

					}
					else {
						vm.ctrl.register.confirm ();
					}

				},
				function error (err){
					vm.ctrl.hideLoader ();
					console.log (err);

				}
			);
		};

		vm.ctrl.register.checkinExistCustomer = function (index){
			vm.model.temporary.register.newCustomer = vm.model.search.register.customers [index];
			vm.ctrl.checkin ();
		}

		vm.ctrl.register.showExistedCus = function(cus){//if created customer is existed
			var customer = {};
			customer.phone = cus.phone;
			customer.email = cus.email;
			customer.fullname = cus.fullname;
			customer.birthday = cus.birthday;
			vm.model.existedCustomer.customers.push(customer)
			vm.model.dom.register.existedCustomerDiv = true;
		}

		vm.ctrl.register.create = function(){
			vm.ctrl.showLoader ();
			CustomerService.createOne(vm.model.register)
				.then(function success(res){
					vm.ctrl.hideLoader();
					if(res.status == 200){
						vm.model.temporary.register.newCustomer = res.data.data;
						vm.ctrl.register.showSuccessMessage ();
					}else{
						vm.ctrl.register.showFailureMessage ();
					}
					
				}, function error(err){
					vm.ctrl.hideLoader();
					console.log(err)
				})
		}	

		vm.ctrl.register.showSuccessMessage = function (){
			// $('#registerConfirmDiv').foundation ('close');
			vm.ctrl.register.closeConfirmDiv ();
			vm.model.dom.register.successDiv = true;
			// $('#createAccountSuccess').foundation('open');
		};

		vm.ctrl.register.showFailureMessage = function (){
			$('#createAccountFailure').foundation('open')
		};	

		vm.ctrl.register.showConfirm = function (){
			// $('#registerConfirmDiv').foundation ('open');
			vm.model.dom.register.confirmDiv = true;
		};

		vm.ctrl.register.closeConfirmDiv = function (){
			vm.model.dom.register.confirmDiv = false;
		}

		vm.ctrl.checkin = function (){
			var newCustomer = vm.model.temporary.register.newCustomer;
			var data = {
				fullname: newCustomer.fullname,
				_id: newCustomer._id,
				email: newCustomer.email,
				phone: newCustomer.phone,
				isStudent: newCustomer.isStudent
			}

			DataPassingService.set ('customer', data);
			$location.url ('/checkin');			
		}

		vm.ctrl.booking = function (){
			// later
		}

		vm.ctrl.showLoader = function (){
			LayoutCtrl.ctrl.showTransLoader ();
		};

		vm.ctrl.hideLoader = function (){
			LayoutCtrl.ctrl.hideTransLoader ();
		};	

		vm.ctrl.reset = function(){
			$route.reload();
		}

		////////////////////////////// INITIALIZE /////////////////////////////////////		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {
			vm.model.dom.data.selected = vm.model.dom.data.vn;
		});	

	}
	
}());