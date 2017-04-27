(function () {
	angular
		.module ('posApp')
		.controller ('assetsCtrl', ['authentication','$location', '$route', 'assetsService', '$http', 'authentication', assetsCtrl])


	function assetsCtrl (authentication,$location, $route, assetsService, $http, authentication) {
		var vm = this;
		vm.tab = 'tab-main';
		vm.assetInfo = {};
		vm.look = {};
		vm.searchResult = {};
		vm.asset = {};
		vm.look.allAssets = [];
		vm.look.fields = ['name', 'category', 'quantity', 'status']

		vm.look.assetsSearchResultDiv = false;
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
		//get all assets
		assetsService.readSome()
			.then(function success(res){
				vm.look.allAssets = res.data.data
				console.log(vm.look.allAssets)
			}, function error(err){
				console.log(err)
			})
		////////////////////////////////////////////////////////
		//Search Asset
		vm.searchFunc = function(){
			assetsService.search(vm.searchInput)
			.then(function success(res){
				console.log(res)
				vm.searchResult.assets = res.data.data;
				vm.look.assetsSearchResultDiv = true;
				//Go to view one customer
				vm.selectAssetToViewProfile = function(index){
					vm.tab = 'tab-profile';
					assetsService.readOne(vm.searchResult.assets[index]._id)
						.then(function success(res){
							vm.asset.info = res.data.data
						})
				}
			}, function error(err){
				console.log(err)
			})
		}

		vm.selectAssetInListToViewProfile = function(index){
			vm.tab = 'tab-profile';
			assetsService.readOne(vm.look.allAssets[index]._id)
				.then(function success(res){
					vm.asset.info = res.data.data
				})
		}
		
		////////////////////////////////////////////////////////
		//Create Page
		vm.createNewAsset = function(){
			vm.assetInfo.name = vm.name
			vm.assetInfo.category = vm.category
			vm.assetInfo.quantity = vm.quantity
			vm.assetInfo.status = vm.status
			vm.assetInfo.userId = authentication.getCurUser().id
			assetsService.createOne(vm.assetInfo)
				.then(function success(res){
					console.log(res)
				}, function error(err){
					console.log(err)
				})
		}
		////////////////////////////////////////////////////////
		//Edit Page
		vm.saveEdit = function(){
			vm.assetData = {}
			
			vm.look.fields.map(function(field){
				vm.assetData[field] = vm.asset.info[field]
			})
			vm.assetData.userId = authentication.getCurUser().id
			vm.data={
				$set:vm.assetData
			}

			assetsService.updateOne(vm.asset.info._id, vm.data)
				.then(function success(res){
					console.log(res)
					$route.reload()
					vm.tab = 'tab-main';
				}, function error(err){
					console.log(err)
				})
		}
		// var vm = this;
		// var hiddenClass = 'is-hidden';

		// vm.other = {};
		// vm.other.curIndex = -1;
		// vm.other.updateMode = '';
		// vm.other.updateBtnName = '';
		// vm.other.message = '';
		// vm.other.messageState = '';
		// vm.other.messageTemplate = '/others/template/message';
		// vm.other.messageDivId = 'messageCallout';
		// vm.other.assetDivId = 'assetList';
		// vm.other.deleteFormModalId = 'deleteFormModal';
		// vm.other.addFormModalId = 'addFormModal';
		// vm.other.editActionName = 'edit';
		// vm.other.deleteActionName = 'delete';


		// // TESTING
		// if ($route.current.locals.checkPermisson.pass){
		// 	//
		// }
		// else {
		// 	$location.path ('/login');
		// 	return
		// }
		// // END	

		// // TESTING: Successfully pass authentication token to server
		// vm.testLogin = function (){
		// 	return $http.post ('/checkout', {}, {
		// 		headers: {
		// 			Authorization: 'Bearer ' + authentication.getToken()
		// 		}
		// 	})
		// 	.then (
		// 		function (data){
		// 			console.log (data);	
		// 	},
		// 		function (err){
		// 			console.log (err);
		// 	});
		// }

		// function resetSelectedAsset (){
		// 	vm.formData = {
		// 		name: '',
		// 		category: '',
		// 		quantity: '',
		// 		status: '',
		// 		reason: '',
		// 	};			
		// }

		// function resetMessage () {
		// 	// hide message
		// 	if (!$('#' + vm.other.messageDivId +'.' + hiddenClass).length){
		// 		$('#' + vm.other.messageDivId).addClass (hiddenClass);
		// 	}

		// 	vm.other.message = '';
		// 	vm.other.messageState = '';			
		// }

		// vm.getSelectedAsset = function (action, index){
		// 	resetMessage ()
			
		// 	if (action == 'add'){
		// 		vm.other.updateBtnName = 'Add';
		// 		vm.other.updateMode = 'create';
		// 		resetSelectedAsset ();

		// 	}

		// 	else if (action == 'edit'){
		// 		// console.log ('click edit')
		// 		vm.other.updateBtnName = 'Submit';
		// 		vm.other.updateMode = 'update';
		// 		vm.formData = {
		// 			name: vm.assets[index].name,
		// 			category: vm.assets[index].category,
		// 			quantity: vm.assets[index].quantity,
		// 			status: vm.assets[index].status,
		// 			reason: '',
		// 		}

		// 		vm.other.curIndex = index;			
		// 	}
		// 	else if (action == 'delete') {
		// 		// console.log ('click delete')
		// 		vm.formData = {
		// 			name: vm.assets[index].name,
		// 			category: vm.assets[index].category,
		// 			quantity: vm.assets[index].quantity,
		// 			status: vm.assets[index].status,
		// 			reason: '',
		// 		}

		// 		vm.other.curIndex = index;			
		// 	}

		
		// };

		// // update or create
		// vm.updateAsset = function () {
		// 	var userId = 11111111; // TESTTING
		// 	var assetId = 131231231; // TESTTING
		// 	var data = vm.formData;
		// 	data.userId = userId;

		// 	if (vm.other.updateMode == 'update'){
				
		// 		assetsService.updateOne (assetId, data)
		// 			.then (
		// 				function (data) {
		// 					console.log (data);
		// 					vm.assets[vm.other.curIndex] = data;
		// 					vm.other.message = 'Succeed to update the asset';
		// 					vm.other.messageState = 'success';						
		// 				},
		// 				function (err){
		// 					console.log (err);
		// 					vm.other.message = 'Fail to update the asset';
		// 					vm.other.messageState = 'warning';						
		// 				}
		// 			)
		// 	}
		// 	else if (vm.other.updateMode == 'create'){

		// 		assetsService.createOne (data)
		// 			.then (
		// 				function (data) {
		// 					// console.log (data);
		// 					vm.assets.push (data.data)
		// 					vm.other.message = 'Succeed to add a new asset';
		// 					vm.other.messageState = 'success';
		// 				},
		// 				function (err){
		// 					console.log (err);
		// 					vm.other.message = 'Fail to add a new asset';
		// 					vm.other.messageState = 'warning';
		// 				}
		// 		)		
				
		// 	}
		// };

		// vm.deleteAsset = function (){
		// 	var idAsset = 111111;

		// 	assetsService.deleteOne (idAsset)
		// 		.then (
		// 			function (data) {
		// 				console.log ('ok');
		// 				vm.assets.splice (vm.other.curIndex, 1)
		// 				vm.other.message = 'Succeed to delete a new asset';
		// 				vm.other.messageState = 'success';
		// 			},
		// 			function (err){
		// 				console.log (err);
		// 				console.log ('error');
		// 				vm.other.message = 'Fail to delete a new asset';
		// 				vm.other.messageState = 'warning';
		// 			}
		// 	)

		// }

		// assetsService.readSome ()
		// 	.then (
		// 		function (data) {
		// 			vm.assets = data.data;
		// 		}
		// 	)
	}

})();