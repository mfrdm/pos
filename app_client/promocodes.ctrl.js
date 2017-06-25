(function() {
    angular.module('posApp')
        .controller('PromocodesCtrl', ['DataPassingService', 'PromocodesService', '$scope', '$window', '$route', PromocodesCtrl])

    function PromocodesCtrl (DataPassingService, PromocodesService, $scope, $window, $route){
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
        		redeem:''
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
        		console.log(vm.model.codeInfo)
        		vm.ctrl.getAllCodes()
        	})
        }

        vm.ctrl.getAllCodes = function(){
        	PromocodesService.readAllCodes().then(function(res){
        		console.log(res.data.data)
        		res.data.data.map(function(ele){
        			var code = Object.assign({}, ele)
        			var newCodeType = vm.model.codeInfo.codeType.filter(function(item){
        				return item.value == code.codeType
        			})[0];
        			code.codeType = newCodeType.label
        			vm.model.dom.code.list.push(code)
        		})
        	})
        }

        /////////////////// Select redeem //////////////////////////////////
        vm.ctrl.selectRedeem = function(){
        	vm.model.temporary.redeem = vm.model.codeInfo.codeType.filter(function(ele){
        		return ele.value == vm.model.promocode.codeType;
        	})[0].label
        }

        vm.ctrl.selectRedeemEdit = function(){
        	vm.model.temporary.redeem = vm.model.codeInfo.codeType.filter(function(ele){
        		return ele.value == vm.model.editPromocode.codeType;
        	})[0].label
        }

        /////////////////// Open Create Promocode Div //////////////////////
        vm.ctrl.openCreatePromocode = function(){
        	vm.model.dom.addCodeDiv = true;
        }

        vm.ctrl.addCode = function(){
        	if(vm.model.promocode.services && vm.model.promocode.name && m.model.promocode.label.en && vm.model.promocode.services.length > 0){
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
        	})[0]
        	vm.model.editPromocode.start = '',
        	vm.model.editPromocode.end = ''
        	console.log(code)
        }

        vm.ctrl.editCode = function(){
        	var editedData = {
        		$set:vm.model.editPromocode
        	}
        	PromocodesService.editCode(vm.model.editPromocode._id, editedData).then(function(res){
        		vm.ctrl.reset()
        	})
        }

        /////////////////// Others ////////////////////////////////////////
        vm.ctrl.reset = function(){
        	$route.reload()
        }
    }
})()