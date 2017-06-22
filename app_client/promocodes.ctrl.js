(function() {
    angular.module('posApp')
        .controller('PromocodesCtrl', ['DataPassingService', 'PromocodesService', '$scope', '$window', '$route', PromocodesCtrl])

    function PromocodesCtrl (DataPassingService, PromocodesService, $scope, $window, $route){
    	var vm = this;
        var LayoutCtrl = DataPassingService.get('layout');
    }
})()