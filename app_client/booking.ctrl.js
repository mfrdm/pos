(function () {
	angular
		.module ('posApp')
		.controller ('BookingCtrl', ['bookingService',BookingCtrl])


	function BookingCtrl (bookingService) {
		var vm = this;
		vm.tab = 'tab-main';
		vm.look = {};
		vm.customer = {};
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
		//get all bookings
		bookingService.readSome()
			.then(function success(res){
				vm.look.allBooking = res.data.data
				console.log(vm.look.allBooking)
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//Search Customer to book for them
		vm.searchCustomer = function(){
			bookingService.searchCustomer(vm.customer.input)
			.then(function success(res){
				console.log(res)
				vm.customer.results = res.data.data;
				vm.look.customerSearchResultDiv = true;
				//Go to view one customer
				vm.selectCustomerToBook = function(index){
					console.log(vm.customer.results[index])
					vm.customer.selected = vm.customer.results[index].lastname + ' ' +vm.customer.results[index].firstname
					vm.customer.input = vm.customer.selected;
					vm.look.customerSearchResultDiv = false;
					////////////////////////////////////////////////////////
					//Booking for customer

					vm.createNewBooking = function(){
						var bookingData = {};
						bookingData._customer = vm.customer.results[index]._id
						bookingData.checkinTime = vm.customer.checkinTime
						console.log(bookingData)
						bookingService.createOne(bookingData)
							.then(function success(res){
								console.log(res)
							}, function error(err){
								console.log(err)
							})
					}
				}
			}, function error(err){
				console.log(err)
			})
		}
		
	}

})();