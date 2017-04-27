angular.module('posApp')
	.controller('CheckinCtrl', ['$scope', 'CheckinService', CheckinCtrl])

//Get data to render all current checked in customers
function CheckinCtrl ($scope, CheckinService){
	var vm = this;
	vm.look = {};
	vm.data = {}; // other data
	vm.status = {};

	// TESTING
	vm.data.storeId = '58fdc7e1fc13ae0e8700008a';
	vm.data.userId = '58eb474538671b4224745192'; // staff
	// END

	vm.searchResult = {};
	vm.look.searchCheckingInCustomerResultDiv = false;
	vm.look.searchEditedCustomerResultDiv = false;
	vm.look.checkInListDiv = true;
	vm.look.checkInEditDiv = false;
	vm.look.checkInDiv = false;

	vm.data.services = { // FIX: no hardcode
		'Private': {
			price: 150000,
			id: 2312312,
		},
		'Common': {
			price: 10000,
			id: 31231,
		},	
	};

	vm.data.otherItems = { // FIX: no hardcode
		'': {
			price: 0,
			id: -1,
		},
		'Coca Cola': {
			price: 7000,
			id: 4233,
		},
		'Poca': {
			price: 7000,
			id: 243,
		},
		'Pepsi': {
			price: 7000,
			id: 343,
		},		
	};

	vm.data.serviceNames = Object.keys (vm.data.services);
	vm.data.otherItemNames = Object.keys (vm.data.otherItems);

	vm.data.currCheckedInIndex = -1; 
	vm.data.checkingInCustomer = getDefaultCheckInData ();

	vm.data.editedCheckedInCustomer = {};

	// Used to fill check-in data
	// FIX: should not include hardcode
	function getDefaultCheckInData (){
		return {
			username: '',
			orderline: [
				{
					productName: 'Common', // default service
					quantity: 1,
					id: vm.data.services['Common'].id,
				},
				{
					productName: '', //
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

	function getDefaultProduct (){
		return 	{
			productName: '', //
			id: '',
			quantity: 0,
		}
	};

	vm.searchCustomers = function(which) {
		CheckinService.searchCustomers(vm.data.checkingInCustomer.username)
		.then(function success (res){
			if (vm.look.checkInDiv && which === 'checkInDiv'){
				vm.searchResult.checkingInCustomers = res.data.data;
				vm.look.checkingInCustomerSearchResultDiv = true;
			}
			else if (vm.look.checkInEditDiv && which === 'checkInEditDiv'){
				vm.searchResult.editedCheckedInCustomers = res.data.data;
				vm.look.editedCustomerSearchResultDiv = true;
			}

		}, function error (err){
			console.log(err)
		});
	}

	vm.selectCustomerToCheckin = function(index){
		vm.data.checkingInCustomer.customer = {
			id: vm.searchResult.checkingInCustomers [index]._id,
			firstname: vm.searchResult.checkingInCustomers [index].firstname,
			lastname: vm.searchResult.checkingInCustomers [index].lastname,
			phone: vm.searchResult.checkingInCustomers [index].phone,			
		}

		vm.look.checkingInCustomerSearchResultDiv = false;
		vm.data.checkingInCustomer.username = vm.data.checkingInCustomer.customer.lastname + ' ' + vm.data.checkingInCustomer.customer.firstname + ' / ' + vm.data.checkingInCustomer.customer.phone + (vm.data.checkingInCustomer.customer.email ? ' / ' + vm.data.checkingInCustomer.customer.email : '');

	}


	vm.addMoreOtherItems = function (which){
		if (which === 'checkingInDiv'){
			vm.data.checkingInCustomer.orderline.push (getDefaultProduct());
		}
		else if (which === 'editedCheckedInDiv'){
			vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
		}
	};

	// // WAIT
	// vm.removeOtherItems = function (index, which){
	// 	if (which == 'checkingInDiv'){
	// 		if (vm.data.checkingInCustomer.orderline.length == 1){
	// 			// do nothing & send message that cannot remove when there is only one item
	// 		}
	// 		else {
	// 			vm.data.checkingInCustomer.orderline.splice (index, 1);
	// 		}
	// 	}
	// 	else if (which === 'editCheckedInDiv'){

	// 	}

	// };

	vm.toggleFilterDiv = function (){
		if (!vm.look.filterDiv) vm.look.filterDiv = true;
		else vm.look.filterDiv = false;
	};

	vm.toggleCheckInDiv = function (){
		if (!vm.look.checkInDiv){
			vm.look.checkInDiv = true;
		}
		else{
			vm.look.checkInDiv = false;
			vm.data.checkingInCustomer = getDefaultCheckInData ();
		}
	};

	vm.toggleCheckInEditDiv = function (index) {
		if (vm.look.checkInEditDiv){ // turn off
			vm.look.checkInEditDiv = false;
			vm.look.checkInListDiv = true;
			vm.data.editedCheckedInCustomer = {}; // reset
		}
		else{ // turn on
			// turn off checkin list div
			// turn on edit div
			// make a deep copy of the data
			// load data to the edit div
			// other tasks

			vm.data.editedCheckedInCustomer = JSON.parse(JSON.stringify(vm.data.checkedInList [index]));
			vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
				x.quantity = parseInt (x.quantity);
			});

			vm.data.editedCheckedInCustomer.username = vm.data.editedCheckedInCustomer.customer.lastname + ' ' + vm.data.editedCheckedInCustomer.customer.firstname + '/ ' + vm.data.editedCheckedInCustomer.customer.phone + '/ ' + (vm.data.editedCheckedInCustomer.customer.email ? vm.data.editedCheckedInCustomer.customer.email : '');

			if (vm.data.editedCheckedInCustomer.orderline.length == 1){
				vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
			}

			vm.look.checkInEditDiv = true;
			vm.look.checkInListDiv = false;
			vm.data.currCheckedInIndex = index;
		}
	};


	////////////////////////////////////////////////////////
	//Checkout Page
	vm.checkout = function(){
		vm.outTime = new Date();
		CheckinService.postCheckOut(vm.oneOrder._id)
			.then(function success(res){
				vm.tab = 'tab-search';
				$route.reload();
			}, function error(err){
				console.log(err);
			})
	};


	// FIX: later send request to server to calculate the total. Can still use it when offline
	vm.getTotal = function (orderline) {
		var total = 0;
		var orderNum = orderline.length;
		var items =  {};
		Object.assign (items, vm.data.services, vm.data.otherItems);

		for (var i = 0; i < orderNum; i++) {
			if (orderline [i].productName) {
				total += (items [orderline [i].productName].price * orderline [i].quantity);
			}
		}

		return total;

	};

	vm.checkin = function(){
		// before checkin

		vm.data.checkingInCustomer.total = vm.getTotal (vm.data.checkingInCustomer.orderline);
		vm.data.checkingInCustomer.storeId = vm.data.storeId;
		vm.data.checkingInCustomer.staffId = vm.data.userId;

		// update id in orderline
		var items =  {};
		Object.assign (items, vm.data.services, vm.data.otherItems);

		vm.data.checkingInCustomer.orderline.map (function (x, i, array){
			x.id = items [x.productName];
		});

		CheckinService.createOne (vm.data.checkingInCustomer.customer.id, vm.data.checkingInCustomer).then(
			function success(data){
				console.log (data)
				// vm.data.checkedInList.push (data);
				// vm.toggleCheckInDiv ();
				vm.status.checkedin = true;
			}, 
			function error(err){
				console.log(err);
				vm.status.checkedin = false;
			}
		);
	}

	vm.updateCheckin = function(){
		var id = vm.data.editedCheckedInCustomer._id;

		// validate
		vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
			if (x.quantity <= 0){
				arr.splice (i, 1);
			}
		});

		CheckinService.updateOne (id, vm.data.editedCheckedInCustomer.orderline).then(
			function (data){

				vm.data.checkedInList[vm.data.currCheckedInIndex].orderline = vm.data.editedCheckedInCustomer.orderline;
				var message = 'Successfully update checked-in information of customer ' + vm.data.editedCheckedInCustomer.username;
				$scope.layout.updateMessage (message, 'success');
				vm.toggleCheckInEditDiv ();
			},
			function (err){
				console.log (err)
				var message = err;
				$scope.layout.updateMessage (message, 'alert');
			}
		);
	};

	//////////////// Initialization ///////////////////////
	var query = { // TESTING
		start: '2017-03-01',
		end: '2017-03-02',
		storeId: vm.data.storeId,
		staffId: vm.data.userId,
	}	

	CheckinService.getCheckinList (query).then(
		function success(res){
			vm.status.getCheckinList = true;
			vm.data.checkedInList = res.data.data;
		}, 
		function error(err){
			vm.status.getCheckinList = false;
			console.log(err)
		}
	);

};
