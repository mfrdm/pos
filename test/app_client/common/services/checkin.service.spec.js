xdescribe ('Service: CheckinService', function (){
	var createController, $httpBackend, CheckinService, checkinListHandler;

	beforeEach (module ('posApp'));
	beforeEach (inject(function ($injector){
		$httpBackend = $injector.get ('$httpBackend');
		CheckinService = $injector.get ('CheckinService');

		checkinListHandler = $httpBackend.when ('GET', /\/api\/orders\\?.*/).respond ([
			{
				_id: 12,
				storeId: 12,
				staffId: 12,
				status: 1,
				customer: {
					customerId: 232,
					firstname: 343,
					lastname: 454,
				},
				checkinTime: '2017-03-01',
				orderline: [
					{
						productName: 'Common',
						quantity: 1,
						productId: 3423,
					},

				]

			},
		]);

	}));

	xit ('should display checkin list', function (){
		
		CheckinService.getCheckinList ({staffId: 1221, storeId: 343}).then(
			function (data){
				expect (data.data[0].staffId).toEqual (12)
			}
		)

		$httpBackend.flush ();
	});


})