
describe ('Controller: CheckinCtrl', function (){
	var CheckinService, Scope, createController, $rootScope, $httpBackend;

	beforeEach (module('posApp'));
	beforeEach (inject (
		function ($injector) {
			$httpBackend = $injector.get ('$httpBackend');
			$rootScope = $injector.get ('$rootScope');
			var $controller = $injector.get ('$controller');
			Scope = $rootScope.$new ();
			CheckinService = $injector.get ('CheckinService');

			// checkinHandler = $httpBackend.when ('GET', /\/checkin\/.*/).respond ({data: []});

			createController = function () {
				return 	$controller ('CheckinCtrl', {
					'$scope': Scope, 
					'CheckinService': CheckinService,
				});
			}

		}
	));

	afterEach (inject (function ($httpBackend){
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	xdescribe ('Initialization', function (){
		it ('should success fetch check-in list', function (){
			var ctrl = createController ();
			$httpBackend.flush ();

			expect (ctrl.status.getCheckinList).toEqual (true)
		});

		it ('should fail fetch check-in list', function (){
			checkinListHandler.respond (401, {message: 'error'});
			var ctrl = createController ();
			$httpBackend.flush ();

			expect (ctrl.status.getCheckinList).toEqual (false)
		});	

	});

	xdescribe ('Check-in', function (){
		// it ('should display check-in form when "check-in" btn being clicked', function (){
		// 	expect(true).toEqual (false);
		// });

		// it ('should submit check-in successfully', function (){

		// });
	})

	xdescribe ('Select a user to check-in', function (){
		it ('should hide user table')

		it ('should update checking-in User');

	});

	describe ('Submit check-in', function (){

		it ('should add other data before submit')

		it ('should calculate total correctly', function (){
			var ctrl = createController (); 
		})
	});

});