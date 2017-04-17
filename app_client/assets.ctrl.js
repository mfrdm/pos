angular
	.module ('posApp')
	.controller ('assetsCtrl', ['assetsService', 'motion', assetsCtrl])
	.directive ('messageWidget', [messageWidget])

// TEST declerative
function messageWidget () {
	return {
		templateUrl: '/others/template/message',
		restrict: 'AE',
		link: function ($scope, $element, $attrs){
			$scope.message = 'Initial value';
			$(document).foundation();
		},
		scope: {
			message: '=',
			messageState: '='
		}
	}
}

// END

function assetsCtrl (assetsService, motion) {
	var vm = this;
	vm.other = {};
	vm.other.curIndex = -1;
	vm.other.updateMode = '';
	vm.other.updateBtnName = '';
	vm.other.message = '';
	vm.other.messageState = '';
	vm.other.messageTemplate = '/others/template/message';

	function resetSelectedAsset (){
		vm.formData = {
			name: '',
			category: '',
			quantity: '',
			status: '',
			reason: '',
		};			
	}

	vm.getSelectedAsset = function (action, index){
		// hide message
		var messageDivId = 'messageCallout';
		motion.hide (messageCallout);

		if (action == 'add'){
			vm.other.updateBtnName = 'Add';
			vm.other.updateMode = 'create';
			resetSelectedAsset ();

		}
		else if (action == 'edit'){
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
		console.log ('delete')
	}

	assetsService.readSome ()
		.then (
			function (data) {
				vm.assets = data.data;
			}
		)
}