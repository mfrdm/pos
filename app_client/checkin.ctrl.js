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
	vm.model.dom.filterDiv = false;
	vm.model.dom.checkInEditDiv = false;
	vm.model.dom.checkOutDiv = false;

	vm.model.customer = {}//Any thing related to customer

	// TESTING
	vm.model.customer.storeId = '58fdc7e1fc13ae0e8700008a';
	vm.model.customer.userId = '58eb474538671b4224745192'; // staff
	// END

	vm.model.customer.services = { // FIX: no hardcode
		//Services pull from Products model
		'Private': {
			price: 150000,
			// id: '58eb474538671b4224745195',
		},
		'Common': {
			price: 10000,
			// id: '58eb474538671b4224745198',
		},
		'': {
			price: 0,
			// id: -1,
		},
		'Coca Cola': {
			price: 7000,
			// id: '58eb474538671b4224745123',
		},
		'Poca': {
			price: 7000,
			// id: '58eb474538671b4224745164',
		},
		'Pepsi': {
			price: 7000,
			// id: '58eb474538671b4224745167',
		},		
	};
	///////////////////////////////////////////////////////////////
	//Get customer data from current created Customer
	function getCheckinCurrentCreatedCus (){
		return {
			orderline: [
				{
					productName: 'Common', // default service
					quantity: 1,
					id: vm.model.customer.services['Common'].id,
				},
				{
					productName: '', //Add more
					quantity: 0,
				},			

			],
			customer: {
				firstname: $scope.layout.currentCustomer.firstname,
				lastname: $scope.layout.currentCustomer.lastname,
				phone: $scope.layout.currentCustomer.phone[0],
				id: $scope.layout.currentCustomer._id,
			}
		}
	}

	
	////////////////////////////////////////////////////////////////
	// Default checkin data
	function getDefaultCheckInData (){
		return {
			orderline: [
				{
					productName: 'Common', // default service
					quantity: 1,
					id: vm.model.customer.services['Common'].id,
				},
				{
					productName: '', //Add more
					quantity: 0,
				},			

			],
			customer: {
				firstname: '',
				lastname: '',
				phone: '',
				id: '',
			}
		}
	};
	vm.model.customer.serviceNames = Object.keys (vm.model.customer.services);

	//Set default value for the order
	vm.model.customer.checkingInData = getDefaultCheckInData ();
	//vm.model.customer.checkingInData is data sent to check in
	
	vm.model.customer.editedCheckedInCustomer = {};
	// Used to fill check-in data
	// FIX: should not include hardcode
	
	//Default empty product to add more to orderline
	function getDefaultProduct (){
		return 	{
			productName: '', //
			id: '',
			quantity: 0,
		}
	};

	//////////////////////////////////////////////////////////////
	//Controller Search
	vm.ctrl.searchCustomers = function(which) {
		CheckinService.searchCustomers(vm.model.search.username)
		.then(function success (res){
			console.log(res)
			if(res.data.data.length == 0){
				vm.model.dom.messageSearchResult = true;
				vm.model.dom.checkingInCustomerSearchResult = false;
			}else{
				if (vm.model.dom.checkInDiv && which === 'checkInDiv'){
					vm.model.search.userResults = res.data.data;
					vm.model.dom.checkingInCustomerSearchResult = true;
					vm.model.dom.messageSearchResult = false;
				}
				// else if (vm.look.checkInEditDiv && which === 'checkInEditDiv'){
				// 	vm.searchResult.editedCheckedInCustomers = res.data.data;
				// 	vm.look.dom.editedCustomerSearchResult = true;
				// }
			}
		}, function error (err){
			console.log(err)
		});
	}
	//////////////////////////////////////////////////////////////
	//Controller Search
	vm.ctrl.selectCustomerToCheckin = function(index){
		vm.model.customer.checkingInData.customer = {
			id: vm.model.search.userResults [index]._id,
			firstname: vm.model.search.userResults [index].firstname,
			lastname: vm.model.search.userResults [index].lastname,
			phone: vm.model.search.userResults [index].phone,			
		}

		vm.model.dom.checkingInCustomerSearchResult = false;
		console.log(vm.model.search.userResults[index])
		vm.model.search.username = vm.model.search.userResults[index].lastname + ' ' + vm.model.search.userResults[index].firstname + ' / ' + vm.model.search.userResults[index].phone[0] + (vm.model.search.userResults[index].email[0] ? ' / ' + vm.model.search.userResults[index].email[0] : '');
	}

	//Get total money
	vm.ctrl.getTotal = function (orderline) {
		var total = 0;
		var orderNum = orderline.length;
		var items =  {};
		Object.assign (items, vm.model.customer.services, vm.model.customer.otherItems);
		for (var i = 0; i < orderNum; i++) {
			if (orderline [i].productName) {
				total += (items [orderline [i].productName].price * orderline [i].quantity);
			}
		}
		return total;
	};

	//Toogle Filter Div
	vm.ctrl.toggleFilterDiv = function (){
		if (!vm.model.dom.filterDiv) vm.model.dom.filterDiv = true;
		else vm.model.dom.filterDiv = false;
	};
	if($scope.layout.currentCustomer){
		vm.model.dom.checkInDiv = true;
		vm.model.customer.checkingInData = getCheckinCurrentCreatedCus();
		vm.model.search.username = $scope.layout.currentCustomer.lastname +' '+ $scope.layout.currentCustomer.firstname + ' / ' +$scope.layout.currentCustomer.email[0]
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

	vm.ctrl.deleteSelectService = function(index){
		// vm.model.selectedItem = vm.model.selectedItem.filter(function(ele){
		// 	return ele.name != vm.model.customer.checkingInData.orderline[index]
		// });
		vm.model.customer.checkingInData.orderline.splice(index+2)
		// vm.model.customer.checkingInData.orderline.splice(index)

	}
	vm.model.customer.checkingInData.promoteCode = ['1234', '12312']
	vm.ctrl.checkin = function(){
		// before checkin

		vm.model.customer.checkingInData.total = vm.ctrl.getTotal (vm.model.customer.checkingInData.orderline);
		vm.model.customer.checkingInData.storeId = vm.model.customer.storeId;
		vm.model.customer.checkingInData.staffId = vm.model.customer.userId;

		// update id in orderline
		var items =  {};
		Object.assign (items, vm.model.customer.services, vm.model.customer.otherItems);

		vm.model.customer.checkingInData.orderline.map (function (x, i, array){
			x.id = items [x.productName];
		});
		vm.model.customer.checkingInData.orderline = vm.model.customer.checkingInData.orderline.filter(function(ele){
			return ele.productName != ''
		})
		if(typeof vm.model.customer.checkingInData.promoteCode == 'string'){
			vm.model.customer.checkingInData.promoteCode = vm.model.customer.checkingInData.promoteCode.split(/[ .:;?!~,`"&|()<>{}\[\]\r\n/\\]+/)
		}
		
		console.log(vm.model.customer.checkingInData.promoteCode)

		// CheckinService.createOne (vm.model.customer.checkingInData.customer.id, vm.model.customer.checkingInData).then(
		// 	function success(data){
		// 		console.log (data.data)
		// 		vm.model.customer.checkedInList.push (data.data.data.orderData);
		// 		// vm.toggleCheckInDiv ();
		// 		//vm.status.checkedin = true;
		// 	}, 
		// 	function error(err){
		// 		console.log(err);
		// 		//vm.status.checkedin = false;
		// 	}
		// );
	}

	//Toggle Ctrl
	vm.ctrl.toggleCheckInDiv = function(){
		if (!vm.model.dom.checkInDiv){
			vm.model.dom.checkInDiv = true;
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
	vm.ctrl.toggleCheckInEditDiv = function (index) {
		if (vm.model.dom.checkInEditDiv){ // turn off
			vm.model.dom.checkInEditDiv = false;
			vm.model.dom.checkInListDiv = true;
			vm.model.customer.editedCheckedInCustomer = {}; // reset
		}
		else{ // turn on
			// turn off checkin list div
			// turn on edit div
			// make a deep copy of the data
			// load data to the edit div
			// other tasks
			vm.model.customer.editedCheckedInCustomer = vm.model.customer.checkedInList[index];
			vm.model.customer.editedCheckedInCustomer.orderline.map (function (x, i, arr){
				x.quantity = parseInt (x.quantity);
			});
			console.log(vm.model.customer.editedCheckedInCustomer)
			vm.model.customer.editedCheckedInCustomer.username = vm.model.customer.editedCheckedInCustomer.customer.lastname + ' ' + vm.model.customer.editedCheckedInCustomer.customer.firstname;

			if (vm.model.customer.editedCheckedInCustomer.orderline.length == 1){
				vm.model.customer.editedCheckedInCustomer.orderline.push (getDefaultProduct());
			}

			vm.model.dom.checkInEditDiv = true;
			vm.model.dom.checkInListDiv = false;
		}
	};

	vm.ctrl.toggleCheckOutDiv = function(index){
		vm.model.dom.checkOutDiv = true;
		console.log(vm.model.customer.checkedInList[index])
		vm.model.customer.checkoutCustomer = vm.model.customer.checkedInList[index]
		vm.ctrl.confirmCheckout = function(){
			CheckinService.postCheckOut(vm.model.customer.checkoutCustomer._id)
				.then(function success(res){
					$route.reload();
				})
		}
	}

	vm.ctrl.reload = function (){
		$route.reload();
	}

	//Update check in
	vm.ctrl.updateCheckin = function(){
		CheckinService.updateOne(vm.model.customer.editedCheckedInCustomer._id, vm.model.customer.editedCheckedInCustomer.orderline)
		.then(function success(res){
			console.log(res)
		})
	}


	//Filter
	vm.model.filter = {};
	vm.model.statusOptions = {
		1:'Checkin', 2:'Checkout'
	}

};
