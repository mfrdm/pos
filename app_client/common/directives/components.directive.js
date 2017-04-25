angular
	.module ('posApp')
	.directive ('messageWidget', [messageWidget])
	.directive ('assetWidget', [assetWidget])
	.directive ('dateTimePicker', [dateTimePicker])
	.directive ('datePicker', [datePicker])

function dateTimePicker (){
	return {
		require: 'ngModel',
		scope: { format: "=" },
		restrict: 'A',
		// link: function(scope, element, attrs){
		// 	$(element).fdatepicker({
		// 		initialDate: '07-05-2017',
		// 		format: 'dd-mm-yyyy  hh:ii',
		// 		disableDblClickSelection: true,
		// 		leftArrow:'<<',
		// 		rightArrow:'>>',
		// 		closeButton: false,
		// 		pickTime: true
		// 	})
		// }
		link: function(scope, element, attrs, ngModel){
            if(typeof(scope.format) == "undefined"){ scope.format = "dd-mm-yyyy" }
            $(element).fdatepicker({format: scope.format}).on('changeDate', function(ev){
                scope.$apply(function(){
                    ngModel.$setViewValue(ev.date);
                }); 
            })
        }
	}
}

function datePicker (){
	return {
		require: 'ngModel',
		scope: { format: "=" },
		restrict: 'A',
		link: function(scope, element, attrs, ngModel){
            if(typeof(scope.format) == "undefined"){ scope.format = "dd-mm-yyyy" }
            $(element).fdatepicker({
            	format: scope.format,
            	disableDblClickSelection: true,
            	initialDate: '07-05-2017'
            }).on('changeDate', function(ev){
                scope.$apply(function(){
                    ngModel.$setViewValue(ev.date);
                }); 
            })
        }
	}
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