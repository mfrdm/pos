angular.module('posApp')
	.controller('CheckinCtrl', ['$scope', '$window','$route','CheckinService', CheckinCtrl])

function CheckinCtrl ($scope, $window, $route, CheckinService){
	var vm = this;

	vm.model = {};
	vm.ctrl = {};

	vm.model.search = {}//Any things related to search
	vm.model.search.messageNoResult = 'No search result? Or '

	
	vm.model.dom = {
		messageSearchResult: false,
		checkingInCustomerSearchResult: false,
	}//anything related to DOM
	vm.model.dom.checkInListDiv = true;
	vm.model.dom.checkInDiv = false;
	vm.model.dom.filterDiv = true;
	vm.model.dom.checkInEditDiv = false;
	vm.model.dom.checkOutDiv = false;

	vm.model.customer = {}//Any thing related to customer
	vm.model.customer.services = {}//All products
	vm.model.selectedToEditItem = {};

	//English - Vietnamese
	vm.model.dom.dataDom = {}
	vm.model.dom.dataDom.using = {}
	vm.model.dom.dataDom.eng = {
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

		invoiceFullname: 'Fullname',
		invoicePhone: 'Phone',
		invoiceOtherProducts: 'Other Products',
		invoiceMainService:'Main Service',
		invoicePromoteCode: 'Promote Code',
		invoiceTotal: 'Total Money',


		headerNo:'No',
		headerName:'Name',
		headerPhone:'Phone',
		headerCheckinDate:'Checkin Date',
		headerCheckinTime:'Checkin Time',
		headerCheckoutDate:'Checkout Date',
		headerCheckoutTime:'Checkout Time',
		headerService:'Service',
		headerCheckout:'Checkout',
		headerEdit:'Edit'
	}

	vm.model.dom.dataDom.vi = {
		title: 'Checkin',
		buttonCheckin: 'Checkin',
		buttonFilter:'Filter',

		selectFirstnameAZ:'Tên theo thứ tự A-Z',
		selectFirstnameZA:'Tên theo thứ tự Z-A',
		selectBookingFarthest: 'Thời gian checkin xa nhất',
		selectBookingLastest: 'Thời gian checkin gần nhất',

		selectStatusOptionAll: 'Hiển thị tất cả khách',
		selectStatusOptionCheckin: 'Hiển thị khách đang checkin',
		selectStatusOptionCheckout: 'Hiển thị khách đã checkout',

		fieldSortBy:'Sắp xếp',
		fieldStatus:'Trạng thái',
		fieldSearchByFirstname:'TÌm kiếm theo tên',
		fieldSearchByPhone:'Tìm kiếm theo Số điện thoại',
		fieldPhoneEmail: 'Phone/Email',
		fieldPromotionCode: 'Mã giảm giá',
		fieldService:'Dịch vụ chính',
		fieldItem: 'Sản phẩm phụ',
		fieldQuantity: 'Số lượng',
		fieldOtherProducts: 'Sản phẩm đã chọn',
		fieldProduct:'Tên sản phẩm',
		fieldAddItems:'Thêm sản phẩm',

		invoiceFullname: 'Họ và tên',
		invoicePhone: 'Số điện thoại',
		invoiceOtherProducts: 'Các sản phẩm mua trước',
		invoiceMainService:'Sản phẩm chính',
		invoicePromoteCode: 'Mã giảm giá',
		invoiceTotal: 'Tổng tiền',


		headerNo:'No',
		headerName:'Họ và tên',
		headerPhone:'Số điện thoại',
		headerCheckinDate:'Ngày Checkin',
		headerCheckinTime:'Giờ Checkin',
		headerCheckoutDate:'Ngày Checkout',
		headerCheckoutTime:'Giờ Checkin',
		headerService:'Sản phẩm chính',
		headerCheckout:'Checkout',
		headerEdit:'Chỉnh sửa'
	}


	vm.model.dom.dataDom.using = vm.model.dom.dataDom.vi;

	//Options
	//Filter
	vm.model.filter = {};
	vm.model.myfilter = {}
	vm.model.orderBy = {};
	vm.model.statusOptions = {
		0:vm.model.dom.dataDom.using.selectStatusOptionAll, 1:vm.model.dom.dataDom.using.selectStatusOptionCheckin, 2:vm.model.dom.dataDom.using.selectStatusOptionCheckout
	}
	vm.model.orderOptions = {
		'customer.firstname': vm.model.dom.dataDom.using.selectFirstnameAZ,
		'-customer.firstname':vm.model.dom.dataDom.using.selectFirstnameAZ,
		'checkinTime': vm.model.dom.dataDom.using.selectBookingFarthest,
		'-checkinTime': vm.model.dom.dataDom.using.selectBookingLastest
	}


	// TESTING
	vm.model.customer.storeId = '58fdc7e1fc13ae0e8700008a';
	vm.model.customer.userId = '58eb474538671b4224745192'; // staff
	// END
	vm.model.listMainProducts = []
	vm.model.listOtherProducts = []
	CheckinService.readSomeProducts()
		.then(function success(res){
			vm.model.listMainProducts = res.data.data.map(function(ele){
				if(ele.category == 1){
					return ele.name
				}
			}).filter(function(ele){return ele != undefined})
			vm.model.listOtherProducts = res.data.data.map(function(ele){
				if(ele.category != 1){
					return ele.name
				}
			}).filter(function(ele){return ele != undefined})
			res.data.data.map(function(ele){
				vm.model.customer.services[ele.name] = {
					price: ele.price,
					_id: ele._id,
					category: ele.category
				}
			})

			vm.model.customer.serviceNames = Object.keys (vm.model.customer.services);
			//Set default value for the order
			vm.model.customer.checkingInData = getDefaultCheckInData ();
			//vm.model.customer.checkingInData is data sent to check in
			
			vm.model.customer.editedCheckedInCustomer = {};

			//Get customer data from current created Customer
			function getCheckinCurrentCreatedCus (){
				return {
					orderline: [
						{
							productName: "Phòng Chung Dành Cho Cá Nhân", // default service
							quantity: 1,
							_id: vm.model.customer.services["Phòng Chung Dành Cho Cá Nhân"]._id,
						},
						{
							productName: '', //Add more
							quantity: 0,
						},			

					],
					customer: {
						firstname: $scope.layout.currentCustomer.firstname,
						middlename: $scope.layout.currentCustomer.middlename,
						lastname: $scope.layout.currentCustomer.lastname,
						phone: $scope.layout.currentCustomer.phone[0],
						_id: $scope.layout.currentCustomer._id,
					}
				}
			}
			//Toogle Filter Div
			vm.ctrl.toggleFilterDiv = function (){
				if (!vm.model.dom.filterDiv) {
					vm.model.dom.filterDiv = true;
					vm.model.dom.checkInEditDiv = false;
					vm.model.dom.checkInDiv = false;
				}
				else vm.model.dom.filterDiv = false;
			};

			if($scope.layout.currentCustomer){
				vm.model.dom.checkInDiv = true;
				vm.model.customer.checkingInData = getCheckinCurrentCreatedCus();
				vm.model.search.username = $scope.layout.currentCustomer.lastname +' '+ ($scope.layout.currentCustomer.middlename ? $scope.layout.currentCustomer.middlename : '') + ' '+ $scope.layout.currentCustomer.firstname + ($scope.layout.currentCustomer.email[0] ? '/' + $scope.layout.currentCustomer.email[0]:'')
			}
		}, function error(err){
			console.log(err)
		})

	////////////////////////////////////////////////////////////////
	// Default checkin data
	function getDefaultCheckInData (){
		return {
			orderline: [
				{
					productName: "Phòng Chung Dành Cho Cá Nhân", // default service
					quantity: 1,
					_id: vm.model.customer.services["Phòng Chung Dành Cho Cá Nhân"]._id,
				},
				{
					productName: '', //Add more
					quantity: 0,
				},			

			],
			customer: {
				firstname: '',
				middlename: '',
				lastname: '',
				phone: '',
				_id: '',
			}
		}
	};
	
	// Used to fill check-in data
	// FIX: should not include hardcode
	
	//Default empty product to add more to orderline
	function getDefaultProduct (){
		return 	{
			productName: '', //
			_id: '',
			quantity: 0,
		}
	};

	//////////////////////////////////////////////////////////////
	//Controller Search
	vm.ctrl.searchCustomers = function(which) {
		CheckinService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			console.log(res.data.data)
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				if (vm.model.dom.checkInDiv && which === 'checkInDiv'){
					vm.model.search.userResults = res.data.data;
					vm.model.dom.checkingInCustomerSearchResult = true;
					vm.model.dom.messageSearchResult = false;
				}
			}
		}, function error (err){
			console.log(err)
		});
	}
	//////////////////////////////////////////////////////////////
	//Controller Search
	vm.ctrl.selectCustomerToCheckin = function(index){
		vm.model.customer.checkingInData.customer = {
			_id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			middlename: vm.model.search.userResults [index].middlename,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone[0],			
		}
		vm.model.customer.checkingInData.promocodes = vm.model.search.userResults [index].promoteCode

		vm.model.dom.checkingInCustomerSearchResult = false;
		console.log(vm.model.search.userResults[index])
		vm.model.search.username = vm.model.search.userResults[index].lastname + ' ' +vm.model.search.userResults[index].middlename+ ' ' + vm.model.search.userResults[index].firstname + ' / ' + vm.model.search.userResults[index].phone[0] + (vm.model.search.userResults[index].email[0] ? ' / ' + vm.model.search.userResults[index].email[0] : '');
	}

	//When select one service, options will reduce
	vm.model.selectedItem = {};
	var count = 0;
	vm.ctrl.selectService = function(){
		vm.model.customer.checkingInData.orderline.map(function(ele){
				if(ele.productName == vm.model.selectedItem.name){
					count += 1;
				}
			})
		if(count == 0 && vm.model.selectedItem.quantity >0 && vm.model.selectedItem.name){
			vm.model.customer.checkingInData.orderline.push({
				productName:vm.model.selectedItem.name,
				quantity: vm.model.selectedItem.quantity
			});
			count = 0;
		}
		count = 0;
	}

	vm.ctrl.selectServiceToEdit = function(){
		vm.model.customer.editedCheckedInCustomer.orderline.map(function(ele){
				if(ele.productName == vm.model.selectedToEditItem.name){
					count += 1;
				}
			})
		if(count == 0 && vm.model.selectedToEditItem.quantity >0 && vm.model.selectedToEditItem.name){
			vm.model.customer.editedCheckedInCustomer.orderline.push({
				productName:vm.model.selectedToEditItem.name,
				quantity: vm.model.selectedToEditItem.quantity
			});
			count = 0;
		}
		count = 0;
	}

	vm.ctrl.deleteSelectService = function(product){
		vm.model.customer.checkingInData.orderline = vm.model.customer.checkingInData.orderline.filter(function(ele){return ele != product})

	}
	vm.ctrl.deleteSelectEditService = function(product){
		vm.model.customer.editedCheckedInCustomer.orderline = vm.model.customer.editedCheckedInCustomer.orderline.filter(function(ele){return ele != product})

	}
	vm.ctrl.checkin = function(){
		// before checkin
		if(vm.model.customer.checkingInData.promocodes){
			if(typeof vm.model.customer.checkingInData.promocodes == 'string'){
				vm.model.customer.checkingInData.promocodes = vm.model.customer.checkingInData.promocodes.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/)
				
			}
			vm.model.customer.checkingInData.promocodes = vm.model.customer.checkingInData.promocodes.map(function(ele){
				return {name:ele}
			})
		}else{
			vm.model.customer.checkingInData.promocodes = []
		}

		console.log(vm.model.customer.checkingInData)
		
		vm.model.customer.checkingInData.storeId = vm.model.customer.storeId;
		vm.model.customer.checkingInData.staffId = vm.model.customer.userId;

		// update id in orderline

		
		vm.model.customer.checkingInData.orderline = vm.model.customer.checkingInData.orderline.filter(function(ele){
			return ele.productName != ''
		})

		vm.model.customer.checkingInData.orderline.map (function (x){
			x._id = vm.model.customer.services [x.productName]._id;
			x.price = vm.model.customer.services [x.productName].price;
		});
		

		console.log(vm.model.customer.checkingInData)
		CheckinService.createOne (vm.model.customer.checkingInData.customer._id, vm.model.customer.checkingInData).then(
			function success(data){
				console.log (data.data)
				vm.model.customer.checkedInList.push (data.data.data.orderData);
				$scope.layout.currentCustomer = null;
				$route.reload();
				vm.model.dom.checkInDiv = false;
			}, 
			function error(err){
				console.log(err);
				$window.alert('Something wrong, please check it')
				//vm.status.checkedin = false;
			}
		);
	}

	//Toggle Ctrl
	vm.ctrl.toggleCheckInDiv = function(){
		if (!vm.model.dom.checkInDiv){
			vm.model.dom.checkInDiv = true;
			vm.model.dom.checkInEditDiv = false;
			vm.model.dom.filterDiv = false;
		}
		else{
			vm.model.dom.checkInDiv = false;
			vm.model.customer.checkingInData = getDefaultCheckInData ();
		}
	}

	//Get checkin List
	var query = { // TESTING
		start: '2017-03-01',
		end: '2017-03-02',
		storeId: vm.model.customer.storeId,
		staffId: vm.model.customer.userId,
	}	

	CheckinService.getCheckinList (query).then(
		function success(res){
			// vm.status.getCheckinList = true;
			vm.model.customer.checkedInList = res.data.data;
		}, 
		function error(err){
			// vm.status.getCheckinList = false;
			console.log(err)
		}
	);

	//Toggle Edit check in
	vm.ctrl.editCheckInCustomer = function (item) {
			vm.model.dom.checkInEditDiv = true;
			vm.model.dom.checkInDiv = false;
			vm.model.dom.checkInListDiv = true;
			vm.model.dom.filterDiv = false;
			var index = vm.model.customer.checkedInList.indexOf(item);

			vm.model.customer.editedCheckedInCustomer = {}; // reset
			vm.model.customer.editedCheckedInCustomer = vm.model.customer.checkedInList[index];
			console.log(vm.model.customer.editedCheckedInCustomer)
			vm.model.customer.editedCheckedInCustomer.orderline.map (function (x, i, arr){
				x.quantity = parseInt (x.quantity);
			});

			if (vm.model.customer.editedCheckedInCustomer.orderline.length == 1){
				vm.model.customer.editedCheckedInCustomer.orderline.push (getDefaultProduct());
			}
			vm.model.customer.editedCheckedInCustomer.orderline = vm.model.customer.editedCheckedInCustomer.orderline.filter(function(ele){
				return ele.productName != ''
			})
			vm.ctrl.edit = function(){
				
				vm.model.customer.editedCheckedInCustomer.orderline.map (function (x){
					x._id = vm.model.customer.services [x.productName]._id;
					x.price = vm.model.customer.services [x.productName].price;
				});

				console.log(vm.model.customer.editedCheckedInCustomer.orderline)
				
				CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer._id, vm.model.customer.editedCheckedInCustomer.orderline)
					.then(function success(res){
						console.log(res)
						$window.alert('Successfully Edit')
						$route.reload();
					}, function error(err){
						console.log(err)
					})
			}
	};
	// 199000, 140.000+59.000

	vm.ctrl.getInvoiceForCheckout = function(item){
		vm.model.dom.checkOutDiv = true;
		var index = vm.model.customer.checkedInList.indexOf(item);
		console.log(vm.model.customer.checkedInList[index])
		CheckinService.readInvoice(vm.model.customer.checkedInList[index]._id)
			.then(function success(res){
				console.log(res.data.data)
				vm.model.customer.checkoutCustomer = res.data.data;
			}, function error(err){
				console.log(err)
			})
	}

	vm.ctrl.confirmCheckout = function(){
		CheckinService.confirmCheckout(vm.model.customer.checkoutCustomer)
			.then(function success(res){
				console.log(res);
				$window.alert('Successfully checkout')
				$route.reload();
			}, function error(err){
				console.log(err)
			})
	}

	vm.ctrl.reload = function (){
		
		vm.model.customer.checkingInData = null;
		$scope.layout.currentCustomer = null;
		$route.reload();
	}

	//Update check in
	vm.ctrl.updateCheckin = function(){
		CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer._id, vm.model.customer.editedCheckedInCustomer.orderline)
		.then(function success(res){
			console.log(res)
		})
	}

};
