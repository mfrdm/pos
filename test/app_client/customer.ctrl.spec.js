describe ('Controller: NewCustomersCtrl', function (){
	var CustomerService, $scope, createController, $rootScope, $httpBackend, DataPassingService, $window, $route, $location, authentication;
	
	var mockCustomerData = {
		// Input
		lastname:'pham',
		middlename:'tuan',
		firstname:'cuong',
		gender:1,
		birthday:'1996-11-28T00:00:00Z',
		email:'paKoTa159@gmail.com',
		phone: '0165666777',
		edu:{
			school:18
		}
	}

	var mockCreatedCustomer = { "_id" : "5924168b164cb9030cee9308", "__v" : 0, "fullname" : "NGUYỄN LAN HƯƠNG", "firstname" : "HƯƠNG", "lastname" : "NGUYỄN", "middlename" : "LAN", "gender" : 2, "birthday" : "1996-11-28T00:00:00Z", "checkinStatus" : false, "bookings" : [ ], "occupancy" : [ ], "updatedAt" : [ ], "createdAt" : "2017-05-23T11:01:31.411Z", "isStudent" : true, "edu" : [ { "title" : "Sinh viên", "_id" : "5924168b164cb9030cee930a" }, { "school" : "-1", "_id" : "5924168b164cb9030cee9309" } ], "email" : [ "Huong.ftuk53gmail.com" ], "phone" : [ "0915645396" ] }

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {

			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			$scope = $rootScope.$new ();

			$window = $injector.get ('$window');
			$location = $injector.get ('$location');
			$route = $injector.get ('$route');

			CustomerService = $injector.get ('CustomerService');
			DataPassingService = $injector.get ('DataPassingService');
			authentication = $injector.get ('authentication')

			var $controller = $injector.get ('$controller');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			createController = function () {
				return 	$controller ('NewCustomersCtrl', {
					DataPassingService: DataPassingService, 
					CustomerService: CustomerService,
					$scope: $scope, 
					$window: $window, 
					$route: $route,
					$location: $location
				});
			};
			createLayout = function(){
				return $controller('LayoutCtrl',{
					$rootScope : $rootScope, 
					$scope : $scope,
					$window : $window,
					$location : $location,
					authentication : authentication,
					DataPassingService : DataPassingService
				})
			}
		}
	));

	afterEach (inject (function ($httpBackend){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	xdescribe ('Toggle Customer Form', function(){

		describe ('Open Create Customer Form', function(){

			it ('should open form in default', function(){
				var layout = createLayout();
				var vm = createController();
				expect(vm.model.dom.register.registerDiv).toBeTruthy()
			})

			it ('should open form if closed before', function(){
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.register.registerDiv = false;
				vm.ctrl.toggleRegisterDiv();
				expect(vm.model.dom.register.registerDiv).toBeTruthy()
			})

		})

		describe ('Close Customer Form', function(){

			it ('should close form if has been opened', function(){
				var layout = createLayout();
				var vm = createController();
				vm.model.dom.register.registerDiv = true;
				vm.ctrl.toggleRegisterDiv();
				expect(vm.model.dom.register.registerDiv).toBeFalsy()
			})

		})

	})

	xdescribe ('Submit form', function(){

		it ('should sanatizeRawData before request server', function(){
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData
			vm.ctrl.register.sanatizeRawData (vm.model.register);
			expect(vm.model.register.firstname).toEqual('Cuong');
			expect(vm.model.register.fullname).toEqual('PHAM TUAN CUONG')
			expect(vm.model.register.isStudent).toBeTruthy()
		})

		it ('should not show customer existed Div and info about existed customer if no existed', function(){
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			expect(vm.model.dom.register.customerExistResultDiv).toBeFalsy()
		})

		it ('should show customer existed Div and info about existed customer if existed', function(){
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.model.dom.register.customerExistResultDiv = false;

			// Have existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: [mockCustomerData]
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			expect(vm.model.dom.register.customerExistResultDiv).toBeTruthy()
		})

		it ('should display confirmation div if not existed customer', function(){
			// Check if existed - return not existed
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			///////////////////////////////////////////////////////

			// Confirmation
			vm.ctrl.register.confirm()
			expect(vm.model.dom.register.confirmDiv).toBeTruthy()
		})

		it ('should have enough infomation in checkin confirmation', function(){
			// Check if existed - return not existed
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.ctrl.register.getSchoolLabel();
			vm.ctrl.register.getGenderLabel();
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			///////////////////////////////////////////////////////

			// Confirmation
			vm.ctrl.register.confirm()
			expect(vm.model.register.fullname).toEqual('PHAM TUAN CUONG');
			expect(vm.model.temporary.register.genderLabel).toEqual('Nam');
			expect(vm.model.temporary.register.schoolLabel).toEqual('Đại học Ngoại thương')
			expect(vm.model.register.email).toEqual('pakota159@gmail.com')
			expect(vm.model.register.phone).toEqual('0165666777')
		})

		it ('should create successful customer when click create', function(){
			// Check if existed - return not existed
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.ctrl.register.getSchoolLabel();
			vm.ctrl.register.getGenderLabel();
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			///////////////////////////////////////////////////////

			// Confirmation
			vm.ctrl.register.confirm()

			// Create
			$httpBackend.when ('POST', '/customers/create').respond ({
				status:200,
				data: mockCreatedCustomer
			});
			vm.ctrl.register.create()
			$httpBackend.flush();
			expect(vm.model.temporary.register.newCustomer).toBeDefined();
		})

		it ('should show successful message when create successfully', function(){
			// Check if existed - return not existed
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.ctrl.register.getSchoolLabel();
			vm.ctrl.register.getGenderLabel();
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			///////////////////////////////////////////////////////

			// Confirmation
			vm.ctrl.register.confirm()

			// Create
			$httpBackend.when ('POST', '/customers/create').respond ({
				status:200,
				data: mockCreatedCustomer
			});
			vm.ctrl.register.create()
			$httpBackend.flush();
			expect(vm.model.dom.register.successDiv).toBeTruthy();
			expect(vm.model.dom.register.confirmDiv).toBeFalsy();
		})

		it ('should redirect to checkin if successful', function(){
			// Check if existed - return not existed
			var layout = createLayout();
			var vm = createController();
			vm.model.register = mockCustomerData;
			vm.ctrl.register.getSchoolLabel();
			vm.ctrl.register.getGenderLabel();
			vm.model.dom.register.customerExistResultDiv = false;
			
			// No existed customer
			$httpBackend.when ('GET', /\/customers\/exist.*/).respond ({
				data: []
			});
			vm.ctrl.register.checkExist();
			$httpBackend.flush();
			///////////////////////////////////////////////////////

			// Confirmation
			vm.ctrl.register.confirm()

			// Create
			$httpBackend.when ('POST', '/customers/create').respond ({
				status:200,
				data: mockCreatedCustomer
			});
			vm.ctrl.register.create()
			$httpBackend.flush();

			vm.ctrl.checkin();
			expect(vm.model.temporary.register.newCustomer.fullname).toEqual('NGUYỄN LAN HƯƠNG')
		})
	})

})