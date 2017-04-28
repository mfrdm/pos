(function () {
	angular
		.module ('posApp')
		.controller ('BookingCtrl', ['$route','bookingService','otherService',BookingCtrl])


	function BookingCtrl ($route,bookingService, otherService) {
		var vm = this;
		vm.tab = 'tab-main';
		vm.look = {};
		vm.customer = {};
		vm.booking = {}

		vm.data = {};
		vm.data.serviceNames = []
		vm.data.locationNames = []

		vm.look.bookingDiv = false;
		vm.look.bookingSearchResultDiv = false;
		////////////////////////////////////////////////////////
		// Setup ng-switch
		vm.toMain = function(){
			vm.tab = 'tab-main'
		}
		
		vm.toEdit = function(){
			vm.tab = 'tab-edit';
		}
		////////////////////////////////////////////////////////
		//Toogle
		vm.toggleBookingDiv = function (){
			if (!vm.look.bookingDiv){
				vm.look.bookingDiv = true;
			}
			else{
				vm.look.bookingDiv = false;
			}
		};
		////////////////////////////////////////////////////////
		//Get products list
		otherService.readSome('products')
			.then(function success(res){
				vm.data.serviceNames = res.data.data
			}, function error(err){
				console.log(err)
			})
		otherService.readSome('companies/depts')
			.then(function success(res){
				vm.data.locationNames = res.data.data
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//get all bookings
		bookingService.readSome()
			.then(function success(res){
				vm.look.allBooking = res.data.data
				console.log(vm.look.allBooking)
				vm.toProfile = function(index){
					vm.tab = 'tab-profile';
					vm.booking = vm.look.allBooking[index]
				}
				vm.deleteBooking = function(index){
					vm.booking = vm.look.allBooking[index]
					var deleteData = {
						$set:{status:4}
					}
					bookingService.updateOne(vm.booking._id, deleteData)
						.then(function success(res){
							console.log(res);
							$route.reload()
						}, function error(err){
							console.log(err)
						})

				}
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//reset all customers search result
		vm.resetSearch = function(){
			vm.customer.results = []
			vm.customer.input = ''
			vm.look.customerSearchResultDiv = false
		}
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
						bookingData.customer = {}
						bookingData.customer.id = vm.customer.results[index]._id
						bookingData.customer.firstname = vm.customer.results[index].firstname
						bookingData.customer.lastname = vm.customer.results[index].lastname
						bookingData.customer.email = vm.customer.results[index].email
						bookingData.checkinTime = vm.customer.checkinTime
						bookingData.message = vm.customer.message
						bookingData.storeName = vm.customer.location.name;
						bookingData.productName = vm.customer.service.name;
						bookingData.quantity = vm.customer.quantity;
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
		////////////////////////////////////////////////////////
		//Search Booking
		vm.searchBooking = function(){
			bookingService.searchBooking(vm.booking.input)
			.then(function success(res){
				console.log(res)
				vm.booking.results = res.data.data;
				vm.look.bookingSearchResultDiv = true;
				//Go to view one booking
				vm.toProfileAfterSearch = function(index){
					vm.tab = 'tab-profile';
					vm.booking = vm.booking.results[index]
				}
				vm.deleteBookingAfterSearch = function(index){
					vm.booking = vm.booking.results[index]
					var deleteData = {
						$set:{status:4}
					}
					bookingService.updateOne(vm.booking._id, deleteData)
						.then(function success(res){
							console.log(res);
							$route.reload()
						}, function error(err){
							console.log(err)
						})

				}
			}, function error(err){
				console.log(err)
			})
		}
		////////////////////////////////////////////////////////
		//Save Edit
		vm.saveEdit = function(){
			console.log(vm.booking)
			vm.data={
				$set:{
					productName:vm.booking.productName,
					status:vm.booking.status,
					quantity:vm.booking.quantity,
					checkinTime:vm.booking.checkinTime
				}
			}

			bookingService.updateOne(vm.booking._id, vm.data)
				.then(function success(res){
					console.log(res)
					$route.reload()
					vm.tab = 'tab-main';
				}, function error(err){
					console.log(err)
				})
		}
	}

})();