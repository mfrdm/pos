app
	.controller('CheckinCtrl', ['$scope','checkinService','$route', CheckinCtrl])

//Get data to render all current checked in customers
function CheckinCtrl ($scope, checkinService, $route){
	var vm = this;
	vm.look = {};
	vm.data = {}; // other data
	vm.status = {};

	// vm.searchResult = {};
	// vm.look.searchCheckingInCustomerResultDiv = false;
	// vm.look.searchEditedCustomerResultDiv = false;
	// vm.look.checkInListDiv = true;
	// vm.look.checkInEditDiv = false;
	// vm.look.checkInDiv = false;

	// vm.data.services = { // Fix: fetch from server
	// 	productName: ['Private', 'Common'],
	// 	price: [100000, 10000]
	// };

	// vm.data.otherItems = { // Fix: fetch from server
	// 	productName: ['', 'Coca', 'Poca', 'Pepsi'],
	// 	price: [0, 10000, 10000, 10000],
	// };  

	// vm.data.currCheckedInIndex = -1; 
	// vm.data.checkingInCustomer = getDefaultCheckInData ();

	// vm.data.editedCheckedInCustomer = {};

	// // Used to fill check-in data
	// // FIX: should not include hardcode
	// function getDefaultCheckInData (){
	// 	return {
	// 		username: '',
	// 		orderline: [
	// 			{
	// 				productName: 'Common', // default service
	// 				price: 10000, //
	// 				quantity: 1,
	// 			},
	// 			{
	// 				productName: '', //
	// 				price: 0,
	// 				quantity: 0,
	// 			},			

	// 		]
	// 	}
	// };

	// function getDefaultProduct (){
	// 	return 	{
	// 		productName: '', //
	// 		price: 0,
	// 		quantity: 0,
	// 	}
	// };

	// vm.searchCustomers = function(which) {
	// 	checkinService.searchCustomers(vm.data.checkingInCustomer.username)
	// 	.then(function success (res){
	// 		if (vm.look.checkInDiv && which === 'checkInDiv'){
	// 			vm.searchResult.checkingInCustomers = res.data.data;
	// 			vm.look.checkingInCustomerSearchResultDiv = true;
	// 		}
	// 		else if (vm.look.checkInEditDiv && which === 'checkInEditDiv'){
	// 			vm.searchResult.editedCheckedInCustomers = res.data.data;
	// 			vm.look.editedCustomerSearchResultDiv = true;
	// 		}

	// 	}, function error (err){
	// 		console.log(err)
	// 	});
	// }

	// vm.selectCustomerToCheckin = function(index){
	// 	Object.assign (vm.data.checkingInCustomer, vm.searchResult.checkingInCustomers [index]);
	// 	vm.look.checkingInCustomerSearchResultDiv = false;
	// 	vm.data.checkingInCustomer.username = vm.data.checkingInCustomer.lastname + ' ' + vm.data.checkingInCustomer.firstname + ' / ' + vm.data.checkingInCustomer.phone + (vm.data.checkingInCustomer.email ? ' / ' + vm.data.checkingInCustomer.email : '');

	// }

	// vm.selectCustomerToEdit = function (index) {
	// 	Object.assign (vm.data.editedCheckedInCustomer, vm.searchResult.editedCheckedInCustomers [index]);
	// 	vm.look.editedCustomerSearchResultDiv = false;
	// 	vm.data.editedCheckedInCustomer.username = vm.data.editedCheckedInCustomer.lastname + ' ' + vm.data.editedCheckedInCustomer.firstname + ' / ' + vm.data.editedCheckedInCustomer.phone;		
	// }

	// vm.addMoreOtherItems = function (which){
	// 	if (which == 'checkingInDiv'){
	// 		vm.data.checkingInCustomer.orderline.push (getDefaultProduct());
	// 	}
	// 	else if (which === 'editedCheckedInDiv'){
	// 		vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
	// 	}
	// };

	// // // WAIT
	// // vm.removeOtherItems = function (index, which){
	// // 	if (which == 'checkingInDiv'){
	// // 		if (vm.data.checkingInCustomer.orderline.length == 1){
	// // 			// do nothing & send message that cannot remove when there is only one item
	// // 		}
	// // 		else {
	// // 			vm.data.checkingInCustomer.orderline.splice (index, 1);
	// // 		}
	// // 	}
	// // 	else if (which === 'editCheckedInDiv'){

	// // 	}

	// // };

	// vm.toggleFilterDiv = function (){
	// 	if (!vm.look.filterDiv) vm.look.filterDiv = true;
	// 	else vm.look.filterDiv = false;
	// };

	// vm.toggleCheckInDiv = function (){
	// 	if (!vm.look.checkInDiv){
	// 		vm.look.checkInDiv = true;
	// 	}
	// 	else{
	// 		vm.look.checkInDiv = false;
	// 		vm.data.checkingInCustomer = getDefaultCheckInData ();
	// 	}
	// };

	// vm.toggleCheckInEditDiv = function (index) {
	// 	if (vm.look.checkInEditDiv){ // turn off
	// 		vm.look.checkInEditDiv = false;
	// 		vm.look.checkInListDiv = true;
	// 		vm.data.editedCheckedInCustomer = {}; // reset
	// 	}
	// 	else{ // turn on
	// 		// turn off checkin list div
	// 		// turn on edit div
	// 		// make a deep copy of the data
	// 		// load data to the edit div
	// 		// other tasks

	// 		vm.data.editedCheckedInCustomer = JSON.parse(JSON.stringify(vm.data.checkedInList [index]));
	// 		vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
	// 			x.quantity = parseInt (x.quantity);
	// 		});

	// 		vm.data.editedCheckedInCustomer.username = vm.data.editedCheckedInCustomer.customer.lastname + ' ' + vm.data.editedCheckedInCustomer.customer.firstname + '/ ' + vm.data.editedCheckedInCustomer.customer.phone + '/ ' + (vm.data.editedCheckedInCustomer.customer.email ? vm.data.editedCheckedInCustomer.customer.email : '');

	// 		if (vm.data.editedCheckedInCustomer.orderline.length == 1){
	// 			vm.data.editedCheckedInCustomer.orderline.push (getDefaultProduct());
	// 		}

	// 		vm.look.checkInEditDiv = true;
	// 		vm.look.checkInListDiv = false;
	// 		vm.data.currCheckedInIndex = index;
	// 	}
	// };


	// ////////////////////////////////////////////////////////
	// //Checkout Page
	// vm.checkout = function(){
	// 	vm.outTime = new Date();
	// 	checkinService.postCheckOut(vm.oneOrder._id)
	// 		.then(function success(res){
	// 			vm.tab = 'tab-search';
	// 			$route.reload();
	// 		}, function error(err){
	// 			console.log(err);
	// 		})
	// };

	// ////////////////////////////////////////////////////////
	// //Checkout Page
	// vm.checkin = function(){
	// 	checkinService.createOne (vm.data.checkingInCustomer, vm).then(
	// 		function success(data){
	// 			console.log (data)
	// 			vm.data.checkedInList.push (data);
	// 			vm.toggleCheckInDiv ();
	// 		}, 
	// 		function error(err){
	// 			console.log(err);
	// 		}
	// 	);
	// }

	// vm.updateCheckin = function(){
	// 	var id = vm.data.editedCheckedInCustomer._id;

	// 	// validate
	// 	vm.data.editedCheckedInCustomer.orderline.map (function (x, i, arr){
	// 		if (x.quantity <= 0){
	// 			arr.splice (i, 1);
	// 		}
	// 	});

	// 	checkinService.updateOne (id, vm.data.editedCheckedInCustomer.orderline).then(
	// 		function (data){

	// 			vm.data.checkedInList[vm.data.currCheckedInIndex].orderline = vm.data.editedCheckedInCustomer.orderline;
	// 			var message = 'Successfully update checked-in information of customer ' + vm.data.editedCheckedInCustomer.username;
	// 			$scope.layout.updateMessage (message, 'success');
	// 			vm.toggleCheckInEditDiv ();
	// 		},
	// 		function (err){
	// 			console.log (err)
	// 			var message = err;
	// 			$scope.layout.updateMessage (message, 'alert');
	// 		}
	// 	);
	// };

	//////////////// Initialization ///////////////////////
	checkinService.getDataOrderCheckin ().then(
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
