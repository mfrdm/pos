(function () {
	angular
		.module ('posApp')
		.controller ('BookingCtrl', ['$scope','$route','bookingService','otherService','$window',BookingCtrl])


	function BookingCtrl ($scope, $route,bookingService, otherService, $window) {
		var vm = this;
		vm.tab = 'tab-main';
		vm.look = {};
		vm.customer = {};
		vm.booking = {};

		vm.booking.all = {}
		vm.customer.intime = {}
		vm.customer.outtime = {}
		vm.customer.intime.year = 2017;
		vm.customer.outtime.year = 2017;
		vm.customer.intime.minute = 0;
		vm.customer.outtime.minute = 0;

		vm.data = {};
		vm.data.serviceNames = []
		vm.data.locationNames = []

		vm.look.bookingDiv = false;
		vm.look.bookingSearchResultDiv = false;

		vm.reload = function(){
			$route.reload();
		}
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
				vm.data.serviceNames = res.data.data.filter(function(ele){return ele.category == 1})
				console.log(vm.data.serviceNames)
			}, function error(err){
				console.log(err)
			})
		otherService.readSome('companies/depts')
			.then(function success(res){
				vm.data.locationNames = res.data.data
				console.log(vm.data.locationNames)
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//get all bookings
		bookingService.readSome()
			.then(function success(res){
				vm.booking.all.results = res.data.data
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
					vm.customer.selected = vm.customer.results[index].lastname + ' ' +vm.customer.results[index].middlename+ ' ' +vm.customer.results[index].firstname
					vm.customer.input = vm.customer.selected;
					vm.look.customerSearchResultDiv = false;
					////////////////////////////////////////////////////////
					//Booking for customer
					
					vm.createNewBooking = function(){
						var bookingData = {};
						bookingData.orderline = {}
						bookingData.customer = {}
						bookingData.customer.id = vm.customer.results[index]._id
						bookingData.customer.firstname = vm.customer.results[index].firstname
						bookingData.customer.lastname = vm.customer.results[index].lastname
						bookingData.customer.middlename = vm.customer.results[index].middlename
						bookingData.customer.email = vm.customer.results[index].email[0]
						bookingData.checkinTime = new Date(vm.customer.intime.year, vm.customer.intime.month - 1, vm.customer.intime.day, vm.customer.intime.hour, vm.customer.intime.minute)
						bookingData.checkoutTime = new Date(vm.customer.outtime.year, vm.customer.outtime.month - 1, vm.customer.outtime.day, vm.customer.outtime.hour, vm.customer.outtime.minute)
						bookingData.message = vm.customer.message
						// bookingData.storeName = vm.customer.location.name;
						// bookingData.productName = vm.customer.service.name;

						// bookingData.storeId = 
						bookingData.orderline.quantity = vm.customer.quantity;
						console.log(vm.customer.service.name)
						bookingData.orderline.productId = vm.data.serviceNames.filter(function(ele){return ele.name == vm.customer.service.name})[0]._id
						bookingData.storeId = vm.data.locationNames.filter(function(ele){return ele.name == vm.customer.location.name})[0]._id
						console.log(bookingData)
						bookingService.createOne(bookingData)
							.then(function success(res){
								console.log(res)
								$route.reload();
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

		////////////////////////////////////////////////////////
		//Accept Booking
		vm.acceptBooking = function(item){
			if($window.confirm('Are you sure to accept this booking')){
				bookingService.readOneCustomer(item.customer.id)
					.then(function success(res){
						$scope.layout.currentCustomer = res.data.data;
						bookingService.updateOne(item._id, {$set:{status:1}})
							.then(function success(res){
								$window.location.href = '/#!/checkin'
							})
					})
			}
		}
		////////////////////////////////////////////////////////
		//Refuse Booking
		vm.refuseBooking = function(item){
			if($window.confirm('Are you sure to refuse this booking')){
				bookingService.updateOne(item._id, {$set:{status:2}})
					.then(function success(res){
						$route.reload();
					})
			}
		}
		////////////////////////////////////////////////////////
		//Cancel Booking
		vm.cancelBooking = function(item){
			if($window.confirm('Are you sure to cancel this booking')){
				bookingService.updateOne(item._id, {$set:{status:4}})
					.then(function success(res){
						$route.reload();
					})
			}
		}
	}

})();