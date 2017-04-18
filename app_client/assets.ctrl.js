angular
	.module ('posApp')
	.controller ('assetsCtrl', ['assetsService', assetsCtrl])


function assetsCtrl (assetsService) {
	var vm = this;
	var hiddenClass = 'is-hidden';

	vm.other = {};
	vm.other.curIndex = -1;
	vm.other.updateMode = '';
	vm.other.updateBtnName = '';
	vm.other.message = '';
	vm.other.messageState = '';
	vm.other.messageTemplate = '/others/template/message';
	vm.other.messageDivId = 'messageCallout';
	vm.other.assetDivId = 'assetList';
	vm.other.deleteFormModalId = 'deleteFormModal';
	vm.other.addFormModalId = 'addFormModal';
	vm.other.editActionName = 'edit';
	vm.other.deleteActionName = 'delete';

	function resetSelectedAsset (){
		vm.formData = {
			name: '',
			category: '',
			quantity: '',
			status: '',
			reason: '',
		};			
	}

	function resetMessage () {
		// hide message
		if (!$('#' + vm.other.messageDivId +'.' + hiddenClass).length){
			$('#' + vm.other.messageDivId).addClass (hiddenClass);
		}

		vm.other.message = '';
		vm.other.messageState = '';			
	}

	vm.getSelectedAsset = function (action, index){
		resetMessage ()
		
		if (action == 'add'){
			vm.other.updateBtnName = 'Add';
			vm.other.updateMode = 'create';
			resetSelectedAsset ();

		}

		else if (action == 'edit'){
			// console.log ('click edit')
			vm.other.updateBtnName = 'Submit';
			vm.other.updateMode = 'update';
			vm.formData = {
				name: vm.assets[index].name,
				category: vm.assets[index].category,
				quantity: vm.assets[index].quantity,
				status: vm.assets[index].status,
				reason: '',
			}

			vm.other.curIndex = index;			
		}
		else if (action == 'delete') {
			// console.log ('click delete')
			vm.formData = {
				name: vm.assets[index].name,
				category: vm.assets[index].category,
				quantity: vm.assets[index].quantity,
				status: vm.assets[index].status,
				reason: '',
			}

			vm.other.curIndex = index;			
		}

	
	};

	// update or create
	vm.updateAsset = function () {
		var userId = 11111111; // TESTTING
		var assetId = 131231231; // TESTTING
		var data = vm.formData;
		data.userId = userId;

		if (vm.other.updateMode == 'update'){
			
			assetsService.updateOne (assetId, data)
				.then (
					function (data) {
						console.log (data);
						vm.assets[vm.other.curIndex] = data;
						vm.other.message = 'Succeed to update the asset';
						vm.other.messageState = 'success';						
					},
					function (err){
						console.log (err);
						vm.other.message = 'Fail to update the asset';
						vm.other.messageState = 'warning';						
					}
				)
		}
		else if (vm.other.updateMode == 'create'){

			assetsService.createOne (data)
				.then (
					function (data) {
						console.log (data);
						// insert new one
						vm.other.message = 'Succeed to add a new asset';
						vm.other.messageState = 'success';
					},
					function (err){
						console.log (err);
						vm.other.message = 'Fail to add a new asset';
						vm.other.messageState = 'warning';
					}
			)		
			
		}
	};

	vm.deleteAsset = function (){
		var idAsset = 111111;

		assetsService.deleteOne (idAsset)
			.then (
				function (data) {
					console.log (data);
					// insert new one
					vm.other.message = 'Succeed to delete a new asset';
					vm.other.messageState = 'success';
				},
				function (err){
					console.log (err);
					vm.other.message = 'Fail to delete a new asset';
					vm.other.messageState = 'warning';
				}
		)	
	}

	assetsService.readSome ()
		.then (
			function (data) {
				vm.assets = data.data;
			}
		)
}