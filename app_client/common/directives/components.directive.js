angular
	.module ('posApp')
	.directive ('messageWidget', [messageWidget])
	.directive ('assetWidget', [assetWidget])
	.directive ('confirmSubmit', [confirmSubmit])

function confirmSubmit(){
	return {
		restrict: 'A',
        compile: function (element, attrs) {
			element.on('submit', function(event) {
				var message = attrs.confirmSubmit ? attrs.confirmSubmit : "Are you sure?";
				if(!confirm(message)){
					event.stopImmediatePropagation();
					event.preventDefault();
				}
			})
        }
    };
}

function messageWidget () {
	return {
		templateUrl: '/components/template/message',
		restrict: 'AE',
		link: function ($scope, $element, $attrs){
			$("#" + $scope.messageDivId).foundation(); // FIX: Should initialize only the element
		},
		scope: {
			message: '=',
			messageState: '=',
			messageDivId: '@'
		}
	}
}

function assetWidget () {
	return {
		templateUrl: '/components/template/asset',
		restrict: 'AE',
		link: function ($scope, $element, $attrs){
			$("#" + $scope.assetListId).foundation();

			$scope.getSelectedAssetToEdit = function (){
				$scope.getSelectedAsset ({
					action: $scope.editAction,
					index: $scope.index
				})
			};

			$scope.getSelectedAssetToDelete = function (){
				$scope.getSelectedAsset ({
					action: $scope.deleteAction,
					index: $scope.index
				})
			}			
		},
		scope: {
			assetListId: '@',
			asset: '=',
			editAction: '@',
			deleteAction: '@',
			addFormModalId: '@',
			deleteFormModalId: '@',
			index: '@',
			getSelectedAsset: '&',
		}

	}
}