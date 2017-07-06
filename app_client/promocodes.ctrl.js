(function() {
    angular.module('posApp')
        .controller('PromocodesCtrl', ['DataPassingService', 'PromocodesService', '$scope', '$window', '$route','moment', PromocodesCtrl])

    function PromocodesCtrl (DataPassingService, PromocodesService, $scope, $window, $route, moment){
    	var vm = this;
        var LayoutCtrl = DataPassingService.get('layout');

        vm.ctrl = {};
        vm.model = {
        	filter:{
        		sorting:'',
        		codeName:'',
        		codeType:''
        	},
        	dom:{
        		filterDiv:false,
        		codeList:true,
        		addCodeDiv:false,
        		editCodeDiv:false,
        		code:{
        			list:[]
        		}
        	},
        	temporary:{
        		redeem:'',
                formula:[],
                editPromocode:{}
        	},
        	codeInfo:{},
        	promocode:{},
        	editPromocode:{}
        };

        vm.model.sortingOptions = [

        ]

        vm.model.expiredOptions = [

        ]

        angular.element(document.getElementById ('mainContentDiv')).ready(function () {// after page load
            vm.ctrl.getCodeInfo();
        });

        vm.ctrl.getCodeInfo = function(){
        	PromocodesService.readCodeInfo().then(function(res){
        		vm.model.codeInfo = res.data.data
        		vm.ctrl.getAllCodes();
        	})
        }

        vm.ctrl.getAllCodes = function(){
        	PromocodesService.readAllCodes().then(function(res){
        		res.data.data.map(function(ele){
        			var code = Object.assign({}, ele)
        			var newCodeType = vm.model.codeInfo.codeType.filter(function(item){
        				return item.value == code.codeType
        			})[0];
                    
        			code.codeType = newCodeType.label;
        			vm.model.dom.code.list.push(code);
        		});
                vm.ctrl.promocode.filterPaginate();
        	})
        }

        vm.ctrl.filterChange = function(){
            vm.ctrl.promocode.filterPaginate();
        }

        /////////////////// Select redeem //////////////////////////////////
        vm.ctrl.selectRedeem = function(){
        	vm.model.temporary.redeem = vm.model.codeInfo.codeType.filter(function(ele){
        		return ele.value == vm.model.promocode.codeType;
        	})[0].label
            vm.model.temporary.formula = vm.model.codeInfo.codeType.filter(function(ele){
                return ele.value == vm.model.promocode.codeType;
            })[0].formula
        }

        vm.ctrl.selectRedeemEdit = function(){
        	vm.model.temporary.redeem = vm.model.codeInfo.codeType.filter(function(ele){
        		return ele.value == vm.model.editPromocode.codeType;
        	})[0].label
            vm.model.temporary.formula = vm.model.codeInfo.codeType.filter(function(ele){
                return ele.value == vm.model.editPromocode.codeType;
            })[0].formula
        }

        /////////////////// Open Create Promocode Div //////////////////////
        vm.ctrl.openCreatePromocode = function(){
        	vm.model.dom.addCodeDiv = true;
        }

        vm.ctrl.addCode = function(){
            vm.model.promocode.excluded = false;
            if(vm.model.promocode.services.length == 4){
                vm.model.promocode.services = ['all']
            };
        	if(vm.model.promocode.services && vm.model.promocode.name && vm.model.promocode.label.en && vm.model.promocode.services.length > 0){
        		PromocodesService.createCode(vm.model.promocode).then(function(res){
	        		vm.model.dom.addCodeDiv = false;
	        		vm.ctrl.reset()
	        	})
        	}
        	
        }

        /////////////////// Toggle Filter Div //////////////////////////////
        vm.ctrl.toggleFilter = function(){
        	if(vm.model.dom.filterDiv){
        		vm.model.dom.filterDiv = false;
        	}else{
        		vm.model.dom.filterDiv = true;
        	}
        }

        /////////////////// Edit code //////////////////////////////////////
        vm.ctrl.openEditCode = function(code){
        	vm.model.dom.editCodeDiv =  true;
        	
        	vm.model.editPromocode = vm.model.dom.code.list.filter(function(ele){
        		return ele._id == code._id
        	})[0];

            vm.model.temporary.formula = vm.model.codeInfo.codeType.filter(function(ele){
                return ele.label == vm.model.editPromocode.codeType;
            })[0].formula;

            vm.model.temporary.redeem = vm.model.editPromocode.codeType;

            var typeValue = vm.model.codeInfo.codeType.filter(function(item){
                return item.label == vm.model.editPromocode.codeType
            })[0].value;

            vm.model.editPromocode.codeType = typeValue;

        	vm.model.temporary.editPromocode.startDate = new Date(vm.model.editPromocode.start);
            vm.model.temporary.editPromocode.startHour = vm.model.temporary.editPromocode.startDate.getHours();
            vm.model.temporary.editPromocode.startMin = vm.model.temporary.editPromocode.startDate.getMinutes();
            vm.model.temporary.editPromocode.endDate = new Date(vm.model.editPromocode.end);
            vm.model.temporary.editPromocode.endHour = vm.model.temporary.editPromocode.endDate.getHours();
            vm.model.temporary.editPromocode.endMin = vm.model.temporary.editPromocode.endDate.getMinutes();

            if(vm.model.editPromocode.services[0] == 'all'){
                vm.model.editPromocode.services = []
                vm.model.codeInfo.services.map(function(item){
                    vm.model.editPromocode.services.push(item.value)
                })
            }
        }

        vm.ctrl.editCode = function(){
            if(vm.model.editPromocode.services.length == 4){
                vm.model.editPromocode.services = ['all']
            };
        	var editedData = {
        		$set:vm.model.editPromocode
        	}
        	PromocodesService.editCode(vm.model.editPromocode._id, editedData).then(function(res){
        		vm.ctrl.reset()
        	})
        }

        //////////////////////////////////Change Start End Time//////////////////////////
        vm.ctrl.timeChangeHandler = function (){
            if (vm.model.temporary.promocode.startMin && vm.model.temporary.promocode.startHour){
                vm.model.promocode.start = new Date (vm.model.temporary.promocode.startDate.toDateString () + ' ' + vm.model.temporary.promocode.startHour + ':' + (vm.model.temporary.promocode.startMin ? vm.model.temporary.promocode.startMin : '0'));
            };
            if (vm.model.temporary.promocode.endMin && vm.model.temporary.promocode.endHour){
                vm.model.promocode.end = new Date (vm.model.temporary.promocode.endDate.toDateString () + ' ' + vm.model.temporary.promocode.endHour + ':' + (vm.model.temporary.promocode.endMin ? vm.model.temporary.promocode.endMin : '0'));
            }
        };

        vm.ctrl.timeChangeHandlerEdit = function(){
            if (vm.model.temporary.editPromocode.startMin && vm.model.temporary.editPromocode.startHour){
                vm.model.editPromocode.start = new Date (vm.model.temporary.editPromocode.startDate.toDateString () + ' ' + vm.model.temporary.editPromocode.startHour + ':' + (vm.model.temporary.editPromocode.startMin ? vm.model.temporary.editPromocode.startMin : '0'));
            };
            if (vm.model.temporary.editPromocode.endMin && vm.model.temporary.editPromocode.endHour){
                vm.model.editPromocode.end = new Date (vm.model.temporary.editPromocode.endDate.toDateString () + ' ' + vm.model.temporary.editPromocode.endHour + ':' + (vm.model.temporary.editPromocode.endMin ? vm.model.temporary.editPromocode.endMin : '0'));
            }
        }

        ////////////////////////////////////////// Paginate for promocode ///////////////////////////////////////
        vm.model.temporary.displayedList = {
            promocode:[],
            promocodeNumber:[]
        };
        vm.model.pagination = {
            promocode:{
                itemsEachPages:5,
                numberOfPages:''
            }
        }
        vm.model.listEachPagePromocode = {}
        vm.ctrl.promocode = {}
        vm.model.promocodePage = {}


        // Slice list after filter
        vm.ctrl.promocode.getFilteredCheckinList = function (){
            // Input
            if(vm.model.dom.code.list.length && vm.model.dom.code.list.length > 0){
                vm.model.temporary.displayedList.promocode = vm.model.dom.code.list.filter(function(item){
                    return (item.name).includes(vm.model.filter.codeName)
                }).filter(function(ele){
                    return (ele.name).includes(vm.model.filter.codeType)
                })
                return vm.model.temporary.displayedList.promocode
            }
        }

        function checkDisabledButtonPromocode(){
            var ind = 0;
            vm.model.temporary.displayedList.promocodeNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+1 == vm.model.temporary.displayedList.promocodeNumber.length){
                vm.model.promocodePage.nextClass = "pagination-next disabled";
                vm.model.promocodePage.goNextText = 'Next'
            }else{
                vm.model.promocodePage.nextClass = "pagination-next";
                vm.model.promocodePage.goNextText = ''
            };
            if(ind == 0){
                vm.model.promocodePage.previousClass = "pagination-previous disabled";
                vm.model.promocodePage.goPreviousText = 'Previous'
            }else{
                vm.model.promocodePage.previousClass = "pagination-previous";
                vm.model.promocodePage.goPreviousText = ''
            }
        }

        vm.ctrl.promocode.goNext = function(){
            var ind = 0;
            vm.model.temporary.displayedList.promocodeNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind+2 <= vm.model.temporary.displayedList.promocodeNumber.length){
                vm.ctrl.promocode.sliceCheckinList(ind+2)
            }
        }

        vm.ctrl.promocode.goPrevious = function(){
            var ind = 0;
            vm.model.temporary.displayedList.promocodeNumber.map(function(ele, index){
                if(ele.class == 'current'){
                    ind = index
                }
            });
            if(ind >= 1){
                vm.ctrl.promocode.sliceCheckinList(ind)
            }
        }

        // Paginate
        vm.ctrl.promocode.paginate = function (afterFilterList){
            if(afterFilterList){
                vm.model.temporary.displayedList.promocodeNumber = []
                vm.model.pagination.promocode.numberOfPages = Math.ceil(
                    afterFilterList.length/vm.model.pagination.promocode.itemsEachPages)
                
                for(var i = 1; i<vm.model.pagination.promocode.numberOfPages+1; i++){
                    vm.model.temporary.displayedList.promocodeNumber.push({number:i, class:''})
                }
                vm.model.temporary.displayedList.promocodeNumber.map(function(ele, index, array){
                    array[0].class = 'current'
                })
                
                checkDisabledButtonPromocode()
                vm.model.listEachPagePromocode.promocode = afterFilterList.slice(0, vm.model.pagination.promocode.itemsEachPages)
                vm.ctrl.promocode.sliceCheckinList = function(i){
                    vm.model.listEachPagePromocode.promocode = afterFilterList.slice((i-1)*vm.model.pagination.promocode.itemsEachPages,i*vm.model.pagination.promocode.itemsEachPages)
                    vm.model.temporary.displayedList.promocodeNumber.map(function(ele, index, array){
                        if(index == i-1){
                            array[index].class = 'current'
                        }else{
                            array[index].class = ''
                        }
                    });
                    
                    checkDisabledButtonPromocode()
                }

                vm.ctrl.promocode.showInPage = function(code){
                    var testArr = vm.model.listEachPagePromocode.promocode.filter(function(ele){
                        return ele.name == code.name && ele.codeType == code.codeType
                    })
                    if(testArr.length > 0){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }

        // // Paginate after filter
        vm.ctrl.promocode.filterPaginate = function (){
            var afterFilterList = vm.ctrl.promocode.getFilteredCheckinList();
            vm.ctrl.promocode.paginate(afterFilterList)
        }

        /////////////////// Others ////////////////////////////////////////
        vm.ctrl.reset = function(){
        	$route.reload()
        }
    }
})()