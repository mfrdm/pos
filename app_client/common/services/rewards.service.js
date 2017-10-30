(function () {
	angular
		.module ('posApp')
		.service ('RewardService', ['$http', RewardService]);

	function RewardService ($http){
		this.getReward = function (){
			var query = {data: JSON.stringify (deposit)};		
			return $http({
				method:'GET',
				url:'/deposits/withdrawCash',
				params: query
			});	
		}

		this.prepareWithdraw = function (rewardId, total){
			var query = {
				rewardId: rewardId,
				total: total
			};
				
			return $http({
				method:'GET',
				url:'/rewards/prepareWithdraw',
				params: query
			});				
		}

		this.withdraw = function (){

		}
	}
})();