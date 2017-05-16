(function (){
	angular.module('posApp')
		.controller('NewCheckinCtrl', ['$scope', '$window','$route','CheckinService', NewCheckinCtrl])

	function NewCheckinCtrl ($scope, $window, $route, CheckinService){
		var LayoutCtrl = $scope.$parent.layout;
		var vm = this;	
		vm.ctrl = {};
		vm.model = {
			checkingin: {
				occupancy: {},
				order: {},
			},
			checkedinList: [],
			checkingCustomer:{
				
			},
			editedCustomer: {

			},
			dom: {
				checkedinList: true,
				data: {},
			}

		};

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

			noResult: 'There is no result'
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

			noResult: 'Không có kết quả'
		}
		
		vm.model.dom.data.selected = vm.model.dom.data.vi;


		vm.ctrl.getCheckedinList = function (){
			CheckinService.getCheckinList().then(
				function success(res){
					vm.model.checkedinList = res.data.data;
				}, 
				function error(err){
					console.log(err)
				}
			);

		};

		vm.ctrl.searchCustomer =  function (){

		};

		vm.ctrl.validatePromocodes = function (){

		};

		vm.ctrl.checkin = function (){

		};

		vm.ctrl.checkout = function (){

		};

		vm.ctrl.updateCheckin = function (){

		}
	};

}());

