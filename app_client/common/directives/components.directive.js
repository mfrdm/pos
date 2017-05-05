angular
	.module ('posApp')
	.directive ('messageWidget', [messageWidget])
	.directive ('assetWidget', [assetWidget])
	.directive ('confirm', [confirm])

function confirm(){
	return {
		restrict: 'A',
        link: function (scope, element, attrs) {
        	var $element = angular.element(element);
			$element.bind('submit', function(event) {
				var message = attrs.confirm;
				var conf = confirm(message);
				if(!conf){
					event.stopImmediatePropagation();
					event.preventDefault();
				}
				scope.$apply();
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