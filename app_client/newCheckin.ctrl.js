(function (){
	angular.module('posApp')
		.controller('NewCheckinCtrl', ['dataPassingService', '$scope', '$window','$route','CheckinService', NewCheckinCtrl])

	function NewCheckinCtrl (dataPassingService, $scope, $window, $route, CheckinService){
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;	
		vm.ctrl = {
			checkin: {},
			editCheckin: {}
		};

		vm.model = {
			staff: LayoutCtrl.user,
			company: LayoutCtrl.company,
			dept: LayoutCtrl.dept,
			services: [
				{name: 'individual common', _id: ''},
				{name: 'group common', _id: ''},
				{name: 'small group private', _id: ''},
				{name: 'medium group private', _id: ''},
			],
			items: {},
			checkingin: {
				occupancy: {},
				order: {},
			},
			checkedinList: {
				data: [],
			},
			checkingCustomer:{
				
			},
			editedCustomer: {

			},
			dom: {
				checkin: {
					checkInDiv: false,
					customerSearchResultDiv: false,
					search: {
						message: {
							notFound: false,
						}
						
					}
				},
				checkedinList: true,
				checkInEditDiv: false,
				
				filterDiv: false,
				data: {},
			},
			search: {
				checkin: {
					username: '',
					customers: [],
				}
			}

		};

		vm.model.search.messageNoResult = 'No search result? Or '
		vm.model.search.messageAlreadyCheckin = 'No User Found! Already Checked in'		

		// English version
		vm.model.dom.data.selected = {}//Using language

		vm.model.dom.data.eng = {
			title: 'Check-in List',
			buttonCheckin: 'Checkin',
			buttonFilter:'Filter',

			selectFirstnameAZ:'Firstname A-Z',
			selectFirstnameZA:'Firstname Z-A',
			selectBookingFarthest: 'Checkin Time Farthest',
			selectCheckinLastest: 'Checkin Time Lastest',

			selectStatusOptionAll: 'All',
			selectStatusOptionCheckin: 'Checkin',
			selectStatusOptionCheckout: 'Checkout',

			fieldSortBy:'Sort By',
			fieldStatus:'Status',
			fieldSearchByFirstname:'Search by Firstname',
			fieldSearchByPhone:'Search by Phone',
			fieldPhoneEmail: 'Phone/Email',
			fieldPromotionCode: 'Promotion Code',
			fieldService:'Service',
			fieldItem: 'Items',
			fieldQuantity: 'Quantity',
			fieldOtherProducts: 'Selected Items',
			fieldProduct:'Product',
			fieldAddItems:'Add Items',
			fieldChooseGroup:'Choose Group',
			fieldCheckoutGroup:'Group',

			invoiceFullname: 'Fullname',
			invoicePhone: 'Phone',
			invoiceOtherProducts: 'Other Products',
			invoiceMainService:'Main Service',
			invoicePromoteCode: 'Promote Code',
			invoiceTotal: 'Total Money',


			headerNo:'No',
			headerName:'Name',
			headerBirthday:'Birthday',
			headerCheckinDate:'Checkin Date',
			headerCheckinTime:'Checkin Time',
			headerCheckoutDate:'Checkout Date',
			headerCheckoutTime:'Checkout Time',
			headerService:'Service',
			headerCheckout:'Checkout',
			headerEdit:'Edit',
			parentGroup:'Group',
			noResult: 'There is no result',
			search: {
				message: {
					notFound: 'Not Found!'
				}
			}
		}

		// Vietnamese version
		vm.model.dom.data.vi = {
			title: 'Checkin',
			buttonCheckin: 'Checkin',
			buttonFilter:'Filter',

			selectFirstnameAZ:'Tên A-Z',
			selectFirstnameZA:'Tên Z-A',
			selectBookingFarthest: 'Checkin Z-A',
			selectBookingLastest: 'Checkin A-Z',

			selectStatusOptionAll: 'Tất cả',
			selectStatusOptionCheckin: 'Checkin',
			selectStatusOptionCheckout: 'Checkout',

			fieldSortBy:'Sắp xếp',
			fieldStatus:'Trạng thái',
			fieldSearchByFirstname:'Tên',
			fieldSearchByPhone:'Số điện thoại',
			fieldPhoneEmail: 'Phone/Email',
			fieldPromotionCode: 'Mã giảm giá',
			fieldService:'Dịch vụ',
			fieldItem: 'Sản phẩm',
			fieldQuantity: 'Số lượng',
			fieldOtherProducts: 'Sản phẩm đã chọn',
			fieldProduct:'Tên sản phẩm',
			fieldAddItems:'Thêm sản phẩm',
			fieldChooseGroup:'Chọn nhóm',
			fieldCheckoutGroup:'Nhóm',

			invoiceFullname: 'Họ và tên',
			invoicePhone: 'Số điện thoại',
			invoiceOtherProducts: 'Sản phẩm',
			invoiceMainService:'Dịch vụ',
			invoicePromoteCode: 'Mã giảm giá',
			invoiceTotal: 'Tổng tiền',

			headerNo:'No',
			headerName:'Họ và tên',
			headerBirthday:'Ngày sinh',
			headerCheckinDate:'Ngày Checkin',
			headerCheckinTime:'Giờ Checkin',
			headerCheckoutDate:'Ngày Checkout',
			headerCheckoutTime:'Giờ Checkout',
			headerService:'Dịch vụ',
			headerCheckout:'Checkout',
			headerEdit:'Chỉnh sửa',
			parentGroup:'Nhóm',
			noResult: 'Không tìm thấy kết quả',
			searchCheckinginCustomerNoResult: 'Không tìm thấy khách hàng ',
			createCustomer: ' Create an account',
			search: {
				message: {
					notFound: 'Không tìm thấy kết quả!'
				}
			}			
		}
		
		vm.model.dom.data.selected = vm.model.dom.data.vi;

		vm.ctrl.getCheckedinList = function (){
			var query = {
				status: 4, // get both checked out and checked in
				storeId: LayoutCtrl.model.dept._id,
			}

			CheckinService.getCheckedinList(query).then(
				function success(res){
					vm.model.checkedinList.data = res.data.data;
				}, 
				function error(err){
					console.log(err);
				}
			);

		};

		vm.ctrl.getDefaultCheckInData = function (){
			return {
				service: {
						name: vm.model.services[0].name, // default service
						_id: vm.model.services[0]._id,
					}
				,
				customer: {
					firstname: '',
					middlename: '',
					lastname: '',
					fullname: '',
					phone: '',
					email:'',
					_id: '',
					// isStudent: '', // use later
				}
			}
		};

		vm.ctrl.getDefaultOrder = function (){
			return {
				orderline:[],
				customer:{},
				storeId: vm.model.dept._id,
				staffId: vm.model.user._id,
			}
		}

		vm.ctrl.checkin.resetSearchCustomerDiv = function (){
			
		};

		vm.ctrl.turnOnCheckinDiv = function (){
			vm.model.dom.checkin.checkinDiv = true;
		}

		vm.ctrl.turnOffCheckinDiv = function (){
			// vm.model.checkingin.occupancy = vm.ctrl.getDefaultCheckInData ();
			// vm.model.dom.checkingInCustomerSearchResult = false;
			vm.model.dom.checkin.checkinDiv = false;
		}			

		vm.ctrl.setCurrentCus = function (){
			// 
		}

		vm.ctrl.toggleFilterDiv = function (){
			if (!vm.model.dom.filterDiv) {
				vm.model.dom.filterDiv = true;
				vm.model.dom.checkInEditDiv = false;
				vm.model.dom.checkin.checkinDiv = false;
			}
			else vm.model.dom.filterDiv = false;
		};

		vm.ctrl.toggleCheckInDiv = function(){
			if (!vm.model.dom.checkin.checkinDiv){
				vm.model.dom.checkInEditDiv = false; // turn off
				vm.model.dom.filterDiv = false; // turn off				
				vm.ctrl.turnOnCheckinDiv ();
			}
			else{
				vm.ctrl.turnOffCheckinDiv ();
			}
		};

		vm.ctrl.seeMore = function(){
			if(vm.model.dom.seeMore == true){
				vm.model.dom.seeMore = false
			}else{
				vm.model.dom.seeMore = true
			}
		}

		vm.ctrl.searchCustomers =  function (){
			CheckinService.searchCustomers(vm.model.search.checkin.username).then(
				function success (res){
					if (!res.data){
						// unexpected result. should never exist
					}
					else{
						if (res.data.data.length){
							vm.model.search.checkin.customers = res.data.data;
							vm.model.dom.checkin.search.message.notFound = false;
							vm.model.dom.checkin.customerSearchResultDiv = true;
							vm.model.dom.messageSearchResult = false;
							vm.model.dom.messageSearchAlreadyCheckin = false;
						}
						else{
							vm.model.dom.checkin.search.message.notFound = true;
							vm.model.dom.checkin.customerSearchResultDiv = false;
						}
					}
				}, 
				function error (err){
					console.log (2)
					console.log(err)
				}
			);
		};

		vm.ctrl.selectCheckinginCustomer = function (index){
			vm.model.checkingin.occupancy.customer = vm.model.checkingin.order.customer = vm.model.search.customers [index];

			vm.model.dom.checkingInCustomerSearchResult = false;
			vm.model.search.username = vm.model.search.customers[index].lastname + ' ' +vm.model.search.customers[index].middlename+ ' ' + vm.model.search.customers[index].firstname + (vm.model.search.customers[index].email[0] ? ' || ' + vm.model.search.customers[index].email[0] : '') + ' || ' + vm.model.search.customers[index].phone[0];			
		}


		vm.ctrl.validatePromocodes = function (){

		};

		vm.ctrl.checkin = function (){

		};

		vm.ctrl.checkout = function (){

		};

		vm.ctrl.updateCheckin = function (){

		};


		////////////////////////// INITIALIZE ///////////////////////////////		
		angular.element(document.getElementById ('mainContentDiv')).ready(function () {
			vm.ctrl.getCheckedinList ();
			$scope.$apply();
		});	

	};

}());

