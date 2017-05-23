(function () {
	angular
		.module ('posApp')
		.controller ('NewBookingCtrl', ['DataPassingService', 'CustomerService', 'BookingService', 'ProductService', '$scope','$route', '$location', '$window', NewBookingCtrl])

	function NewBookingCtrl (DataPassingService, CustomerService, BookingService, ProductService, $scope, $route, $location, $window) {
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;

		vm.ctrl = {
			booking: {},
			bookingList: {},
		};

		vm.model = {
			services: [],
			booking: {
				quantity: 1, // default
				staffId: LayoutCtrl.model.user._id || LayoutCtrl.model.user.id,
			},
			bookingList:{
				data: [],
			},
			dom: {
				booking: {
					customerSearchResultDiv: false,
					bookingDiv: false,
					confirmDiv: false,
					search: {
						message: {
							notFound: false,
						}
						
					},					
				},
				bookingList: {
					cancelConfirmDiv: false,
				},
				data: {},				
			},
			search: {
				booking: {

				}
			},
			temporary: {
				booking: {},
				bookingList: {}
			}
		};

		vm.model.dom.data.eng = {
			title:'Booking List',
			modelLanguage: 'en',
			location: [
				{name: 'Green Space Chua Lang', label: 'Green Space Chùa Láng'}
			],
			booking: {
				search:{
					label: {
						username: 'Customer'
					},
					placeholder: {
						username: 'Enter name/phone to search customers'
					},
					message:{
						notFound:'Not found customer'
					},
					header:{
						number:'No',
						fullname:'Fullname',
						email:'Email',
						phone: 'Phone'
					}
				},
				location:'Location',
				service:'Service',
				quantity:'Number of members',
				checkinDate:'Checkin Date',
				hour:'Hour',
				minute:'Minute',
				spendHours:'Spent Hours',
				otherRequirements:'Other requirements'
				
			},
			bookingList:{
				number:'No',
				fullname:'Fullname',
				service:'Service',
				checkin:'Checkin'
			},
			noResult: 'Not found result',
			search: {
				message: {
					notFound: 'Not found result',
				}
			},						
		};

		vm.model.dom.data.vn = {
			title:'Booking List',
			modelLanguage: 'vn',
			location: [
				{name: 'Green Space Chua Lang', label: 'Green Space Chùa Láng'}
			],
			booking: {
				search:{
					label: {
						username: 'Khách hàng'
					},
					placeholder: {
						username: 'Nhập sđt, email, hoặc tên để tìm kiếm khách hàng'
					},
					message:{
						notFound:'Không tìm thấy kết quả'
					},
					header:{
						number:'No',
						fullname:'Họ và tên',
						email:'Email',
						phone: 'Sdt'
					}
				},
				location:'Địa Điểm',
				service:'Dịch vụ',
				quantity:'Số lượng thành viên',
				checkinDate:'Check-in ngày',
				hour:'Giờ',
				minute:'Phút',
				spendHours:'Số giờ sử dụng',
				otherRequirements:'Yêu cầu khác'
				
			},
			bookingList:{
				number:'No',
				fullname:'Tên',
				service:'Dịch vụ',
				checkin:'Checkin'
			},
			noResult: 'Không tìm thấy kết quả',
			search: {
				message: {
					notFound: 'Không tìm thấy kết quả!',
				}
			},							
		};

		vm.model.dom.data.selected = {};

		vm.model.dom.data.selected = vm.model.dom.data.vn

		vm.ctrl.bookingList.fetch = function (){
			var q = {
				status: [3,5],
				storeId: LayoutCtrl.model.dept._id,
			};

			BookingService.readAll (q).then (
				function success (res){
					vm.model.bookingList.data = res.data.data;
					vm.model.bookingList.data.map (function (x,i,arr){
						vm.ctrl.addServiceLabel (x.service);
					});
					
				},
				function failure (err){
					console.log (err);
					// display warning
				}
			)
		}

		vm.ctrl.addServiceLabel = function (service){
			if (service.name.toLowerCase () == 'group common'){
				if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm chung';
				else service.label = service.name;
			}
			else if (service.name.toLowerCase () == 'individual common'){
				if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Cá nhân';
				else service.label = service.name;
			}
			else if (service.name.toLowerCase () == 'small group private'){
				if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 15';
				else service.label = service.name;
			}
			else if (service.name.toLowerCase () == 'medium group private'){
				if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 30';
				else service.label = service.name;
			}
			else if (service.name.toLowerCase () == 'large group private'){
				if (vm.model.dom.data.selected.modelLanguage == 'vn') service.label = 'Nhóm riêng 40';
				else service.label = service.name;
			}														
		}

		// FIX: actually fetch from server
		vm.ctrl.booking.getLocations = function (){
			var locs =  [{
				name: LayoutCtrl.model.dept.name,
				_id: LayoutCtrl.model.dept._id
			}];

			vm.model.dom.data.selected.locations = locs;
			vm.model.booking.location = locs[0]; // set default value
		}

		// Get both items and services
		vm.ctrl.booking.getItems = function (){
			ProductService.readSome().then(
				function success(res){
					res.data.data.map(function(x, i, arr){
						if(x.category == 1){
							vm.model.services.push(x);
						}
					});

					// push data into dom.data objects
					vm.model.services.map (function (x, i, arr){
						vm.ctrl.addServiceLabel (x);
					});
					
					vm.model.dom.data.selected.services = vm.model.services;
				},
				function error (err){
					console.log (err);
				}
			);			
		};

		vm.ctrl.booking.toggleBookingDiv = function (){
			if (!vm.model.dom.booking.bookingDiv){
				vm.model.dom.booking.bookingDiv = true;
			}
			else{
				vm.ctrl.reset ();
			}
			
		};

		vm.ctrl.booking.checkinTimehangeHandler = function (){
			if (vm.model.temporary.booking.checkinDate && vm.model.temporary.booking.checkinHour){
				vm.model.booking.checkinTime = new Date (vm.model.temporary.booking.checkinDate.toDateString () + ' ' + vm.model.temporary.booking.checkinHour + ':' + (vm.model.temporary.booking.checkinMin ? vm.model.temporary.booking.checkinMin : '0'));
				if (vm.model.temporary.booking.checkinDuration){
					var checkinTime = new Date (vm.model.booking.checkinTime);
					vm.model.booking.checkoutTime = new Date (checkinTime.setHours (checkinTime.getHours() + vm.model.temporary.booking.checkinDuration));					
				}
			}
		};


		vm.ctrl.booking.searchCustomer = function (){
			CustomerService.readCustomers (vm.model.search.booking.username).then(
				function success (res){
					if (!res.data){
						// unexpected result. should never exist
					}
					else{
						if (res.data.data.length){
							vm.model.search.booking.customers = res.data.data;
							vm.model.dom.booking.search.message.notFound = false;
							vm.model.dom.booking.customerSearchResultDiv = true;
						}
						else{
							vm.model.dom.booking.search.message.notFound = true;
							vm.model.dom.booking.customerSearchResultDiv = false;
						}
					}
				}, 
				function error (err){
					console.log(err)
				}
			);			
		};

		vm.ctrl.booking.selectCustomer = function (index){
			vm.model.booking.customer = {
				firstname: vm.model.search.booking.customers [index].firstname,
				lastname: vm.model.search.booking.customers [index].lastname,
				middlename: vm.model.search.booking.customers [index].middlename,
				fullname: vm.model.search.booking.customers [index].fullname,
				_id: vm.model.search.booking.customers [index]._id,
				phone: vm.model.search.booking.customers [index].phone[0],
				email: vm.model.search.booking.customers [index].email[0]	,
				isStudent: vm.model.search.booking.customers [index].isStudent,
			}
			
			vm.model.search.booking.username = vm.model.search.booking.customers[index].fullname + (vm.model.search.booking.customers [index].email[0] ? ' || ' + vm.model.search.booking.customers [index].email[0] : '') + (vm.model.search.booking.customers [index].phone[0] ? ' || ' + vm.model.search.booking.customers [index].phone[0] : '');
			
			vm.ctrl.booking.resetSearchCustomerDiv ();			
		};


		vm.ctrl.booking.resetSearchCustomerDiv = function (){
			vm.model.dom.booking.customerSearchResultDiv = false;
			vm.model.search.booking.customers = [];			
		};

		vm.ctrl.booking.closeConfirm = function (){
			vm.model.dom.booking.confirmDiv = false;
		}

		vm.ctrl.booking.confirm = function (){
			vm.model.dom.booking.confirmDiv = true;
		}

		vm.ctrl.booking.book = function (){
			BookingService.book (vm.model.booking).then (
				function success (res){
					vm.ctrl.reset ();
				},
				function failure (err){
					console.log (err);
					// display warining
				}
			);
		};

		// Refuse a booking of a customer
		vm.ctrl.bookingList.refuse = function (){

		};

		// Accept a booking
		vm.ctrl.bookingList.accept = function (){

		};

		// Cancel a booking on behaft of a customer
		vm.ctrl.bookingList.cancel = function (){
			var curBooking = vm.model.temporary.canceledBooking;
			var update = {
				$set: {status: 4}
			};

			BookingService.updateOne (curBooking._id, update).then (
				function success (res){
					vm.ctrl.reset ();
				},
				function failure (err){
					console.log (err);
					// display warning
				}
			)
		};

		vm.ctrl.bookingList.confirmCancel = function (index){
			vm.model.dom.bookingList.cancelConfirmDiv = true;
			vm.model.temporary.canceledBooking = vm.model.bookingList.data [index];
			console.log (vm.model.temporary.canceledBooking)
		}

		vm.ctrl.bookingList.closeCancel = function (){
			vm.model.dom.bookingList.cancelConfirmDiv = false;
			vm.model.temporary.canceledBooking = [];
		}

		vm.ctrl.bookingList.checkin = function (index){
			var curBooking = vm.model.bookingList.data[index];
			var data = {
				service: curBooking.service,
				customer: curBooking.customer,
				bookingId: curBooking._id,
			}

			DataPassingService.set ('booking', data);
			$location.url ('/checkin');

		};

		vm.ctrl.reset = function (){
			$route.reload ();
		};

		////////////////////////////// INITIALIZE ///////////////////////////////		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {
			vm.model.dom.data.selected = vm.model.dom.data.vn;
			vm.ctrl.booking.getLocations ();
			vm.ctrl.booking.getItems ();
			vm.ctrl.bookingList.fetch ();
			$scope.$apply();
		});			

	}

}());