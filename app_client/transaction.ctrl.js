(function() {
    angular.module('posApp')
        .controller('TransactionCtrl', ['DataPassingService', 'TransactionService', '$scope', '$window', '$route', TransactionCtrl])

    function TransactionCtrl (DataPassingService, TransactionService, $scope, $window, $route){
    	var vm = this;
        var LayoutCtrl = DataPassingService.get('layout');

        vm.ctrl = {};
        vm.model = {
            trans:{},
            editTrans:{},
            report:{
                revenue:0,
                cost:0,
                profit:0
            },
            dom:{
                filterDiv:false,
                addTransaction : false,
                editTransaction:false,
                report:false,
                transList:true,
                trans:{
                    list:[]
                }
            },
            temporary:{
                transTypeList:[],
                trans:{}
            },
            filter:{
                startTime:'',
                endTime:'',
                time:1,
            }
        };

        vm.model.temporary.transTypeList = [
            {value: 1, label:'Occupancy'},
            {value: 2, label:'Order'},
            {value: 3, label:'Inbound'},
            {value: 4, label:'Outbound'},
            {value: 5, label:'Deposit'},
            {value: 6, label:'Others'}
        ]

        // Initial
        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.ctrl.getTransList();
        });

        // Toggle Filter
        vm.ctrl.toggleFilter = function(){
            if(vm.model.dom.filterDiv){
                vm.model.dom.filterDiv = false;
            }else{
                vm.model.dom.filterDiv = true;
            }
        }

        // Time change
        vm.ctrl.timeChangeHandler = function(){
            if (vm.model.temporary.trans.startMin && vm.model.temporary.trans.startHour){
                vm.model.temporary.trans.start = new Date (vm.model.temporary.trans.startDate.toDateString () + ' ' + vm.model.temporary.trans.startHour + ':' + (vm.model.temporary.trans.startMin ? vm.model.temporary.trans.startMin : '0'));
            };
            if (vm.model.temporary.trans.endMin && vm.model.temporary.trans.endHour){
                vm.model.temporary.trans.end = new Date (vm.model.temporary.trans.endDate.toDateString () + ' ' + vm.model.temporary.trans.endHour + ':' + (vm.model.temporary.trans.endMin ? vm.model.temporary.trans.endMin : '0'));
            };
            getList(vm.model.temporary.trans.start, vm.model.temporary.trans.end)
        }

        // Function get trans list
        function getList(start, end){
            TransactionService.readTrans(start, end).then(function(res){
                vm.model.dom.trans.list = []
                res.data.data.map(function(ele){
                    vm.model.temporary.transTypeList.map(function(item){
                        if(ele.transType == item.value){
                            ele.transType = item.label
                        }
                    })
                    if(ele.amount >= 0){
                        ele.category = 'Revenue'
                    }else{
                        ele.category = 'Cost'
                    }
                    vm.model.dom.trans.list.push(ele)
                })
            })
        }

        // Get trans list
        vm.ctrl.getTransList = function(){
            var start = new Date();
            start.setHours(0,0,0,0);
            var end = new Date();
            end.setHours(23,59,59,999);
            getList(start, end)
        }

        // Open add trans
        vm.ctrl.openCreateTrans = function(){
            vm.model.dom.addTransaction = true;
        }

        // Add trans
        vm.ctrl.addTrans = function(){
            vm.model.trans.transType = 6;
            TransactionService.createTrans(vm.model.trans).then(function(res){
                vm.ctrl.reset();
            })
        }

        // Edit trans
        vm.ctrl.openEditTrans = function(tran){
            vm.model.dom.editTransaction = true;
            vm.model.temporary.transTypeList.map(function(item){
                if(tran.transType == item.label){
                    tran.transType = item.value
                }
            })
            vm.model.editTrans = tran;
        }

        vm.ctrl.editTrans = function(){
            TransactionService.editTrans(vm.model.editTrans._id, vm.model.editTrans).then(function(res){
                vm.ctrl.reset();
            })
        }

        // Open report
        vm.ctrl.openReport = function(){            
            vm.model.dom.trans.list.map(function(item){
                if(item.amount >=0){
                    vm.model.report.revenue += item.amount
                }else{
                    vm.model.report.cost += item.amount
                }
            })
            vm.model.report.profit = vm.model.report.revenue + vm.model.report.cost;
            vm.model.dom.report = true;
        }

        // Reset
        vm.ctrl.reset = function(){
            vm.model.dom.addTransaction = false;
            vm.model.dom.editTransaction = false;
            vm.model.dom.filterDiv = false;
            vm.model.dom.report = false;
            vm.model.trans = {};
            vm.model.editTrans = {};
            vm.model.temporary.trans = {};
            vm.ctrl.getTransList()
        }
    }
})()