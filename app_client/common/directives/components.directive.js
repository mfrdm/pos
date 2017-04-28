angular
	.module ('posApp')
	.directive ('messageWidget', [messageWidget])
	.directive ('assetWidget', [assetWidget])
	.directive ('ngConfirmClick', [ngConfirmClick])

function ngConfirmClick(){
	return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            element.bind('click',function (event) {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
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