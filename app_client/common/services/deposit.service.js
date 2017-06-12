angular.module ('posApp')
	.service ('DepositService', ['$http','$q', DepositService])

function DepositService ($http, $q){
	this.readDefaultAccounts = function (){
		return $http({
			method:'GET',
			url:'/deposits/account/default'
		});
	}

	this.readInvoice = function (deposit){
		return $http({
			method:'GET',
			url:'/deposits/invoice',
			params: {deposit: JSON.stringify (deposit)}
		});		
	}

	this.createOneDeposit = function (deposit){
		return $http({
			method:'POST',
			url:'/deposits/create',
			data: deposit
		});			
	}
}