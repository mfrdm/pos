(function() {
    angular.module('posApp')
        .controller('TransactionCtrl', ['DataPassingService', 'TransactionService', '$scope', '$window', '$route', TransactionCtrl]);

    function TransactionCtrl (DataPassingService, TransactionService, $scope, $window, $route){
        
        /*
        Variables
        */
        var vm = this;
        var LayoutCtrl = DataPassingService.get('layout');

        vm.ctrl = {
            get:{}, // functions help get data from server
            dom:{}, // functions help open, toggle dom
            support:{}, // functions supports for others funcs like paginate
        };

        vm.model = {
            create:{}, // data to create trans
            edit:{}, // data to edit trans
            dom:{}, // data for showing div
            filter:{}, // data for filtering
            temporary:{}, // data to be manipulated, clear when reset
            data:{}, // data to be stored after get from server or predefined
            options:{},  // data for options list (for selecting).
        };

        // Dom model
        vm.model.dom.dateColumn = false;

        // Data model
        vm.model.data.listEachPage = [];
        vm.model.data.itemsEachPage = 5;

        // Options model
        vm.model.options.transType = [
            {value: 1, label:'Occupancy'},
            {value: 2, label:'Order'},
            {value: 3, label:'Inbound'},
            {value: 4, label:'Outbound'},
            {value: 5, label:'Deposit'},
            {value: 6, label:'Others'},
        ];

        /*
        Dom functions
        */

        // Open add transaction form
        vm.ctrl.dom.openTransForm = function(){

        };

        // Open edit transaction form
        vm.ctrl.dom.openEditTransForm = function(){

        };

        // Open report
        vm.ctrl.dom.openReport = function(){

        };

        // Toggle filter
        vm.ctrl.dom.toggleFilter = function(){

        };

        // Toggle date/time column
        vm.ctrl.dom.toggleDateColumn = function(){
            if(vm.model.dom.dateColumn){
                vm.model.dom.dateColumn = false;
            }else{
                vm.model.dom.dateColumn = true;
            };
        };

        /*
        Get functions
        */

        // Get transactions list to show
        vm.ctrl.get.transList = function(){
            vm.model.data.transList = [];
            var start = new Date("07/06/2017");
            start.setHours(0,0,0,0);
            var end = new Date();
            end.setHours(23,59,59,999);

            // Get transaction from db, then add transType label, category
            TransactionService.readTrans(start, end).then(function(res){
                res.data.data.map(function(item){
                    vm.model.options.transType.map(function(type){
                        if(item.transType === type.value){
                            item.transType = type.label;
                        };
                    });
                    if(item.amount >= 0){
                        item.category = 'Revenue'
                    }else{
                        item.category = 'Cost'
                    };
                    vm.model.data.transList.push(item);
                });

                vm.ctrl.support.handlePagination(vm.model.data.itemsEachPage,vm.model.data.transList);
            });
        };

        /*
        Support functions
        */

        // Pagination
        vm.ctrl.support.handlePagination = function(itemsEachPage, filteredList, index){
            if(filteredList && filteredList.length){

                // Array to keep track page number, where the page is
                vm.model.data.pageNumbers = [];

                // List in each page
                vm.model.data.listEachPage = [];

                // return number of pages
                var numberOfPages = Math.ceil(filteredList.length/itemsEachPage)

                for(var j = 1; j<numberOfPages+1; j++){
                    vm.model.data.pageNumbers.push({number:j, class:''})
                };

                vm.model.data.pageNumbers[0].class = 'current';

                vm.model.data.listEachPage = filteredList.slice(0, itemsEachPage);

                // When click to page number, will re-slice filteredList
                if(index){
                    vm.model.data.listEachPage = filteredList.slice((index-1)*itemsEachPage, index*itemsEachPage);
                    vm.model.data.pageNumbers.map(function(item, ind, arr){
                        if(ind == index - 1){
                            arr[ind].class = 'current';
                        }else{
                            arr[ind].class = ''
                        };
                    });
                };

                // Check disable button
                var ind = 0;

                vm.model.data.pageNumbers.map(function(ele, index){
                    if(ele.class == 'current'){
                        ind = index
                    };
                });

                if(ind+1 == vm.model.data.pageNumbers.length){
                    vm.model.dom.nextClass = "pagination-next disabled";
                    vm.model.dom.goNextText = 'Next'
                }else{
                    vm.model.dom.nextClass = "pagination-next";
                    vm.model.dom.goNextText = ''
                };

                if(ind == 0){
                    vm.model.dom.previousClass = "pagination-previous disabled";
                    vm.model.dom.goPreviousText = 'Previous'
                }else{
                    vm.model.dom.previousClass = "pagination-previous";
                    vm.model.dom.goPreviousText = ''
                };
            };
        };

        vm.ctrl.support.goNext = function(){
            var ind = 0;
            vm.model.data.pageNumbers.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.data.pageNumbers.length){
                vm.ctrl.support.handlePagination(vm.model.data.itemsEachPage, vm.model.data.transList, ind+2)
            }
        }

        vm.ctrl.support.goPrevious = function(){
            var ind = 0;
            vm.model.data.pageNumbers.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.support.handlePagination(vm.model.data.itemsEachPage,vm.model.data.transList, ind)
            }
        }

        /*
        Initial
        */
        angular.element(document.getElementById ('mainContentDiv')).ready(function () { // after page load
            vm.ctrl.get.transList(); // get data to show transaction list
        });

    };
})()
