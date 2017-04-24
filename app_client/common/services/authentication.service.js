(function () {
	angular
		.module ('posApp')
		.service ('authentication', ['$window', '$http', authentication]);

	function authentication ($window, $http) {
		var tokenKey = 'posAppToken';
		this.saveToken = function (token) {
			$window.localStorage [tokenKey] = token;
		};

		this.getToken = function (){
			return $window.localStorage[tokenKey];
		};

		this.register = function (user, successAction, failAction){
			var auth = this;
			return $http.post ('/api/register', user).then (
				function (data){
					auth.saveToken (data.data.token);
					successAction (data);
				},
				function (err){
					console.log (err);
					failAction (err);
				}
			)
		};

		this.login = function (user, successAction, failAction){
			var auth = this;
			return $http.post ('/api/login', user).then (
				function (data){
					console.log (data)
					auth.saveToken (data.data.token);
					successAction (data);
				},
				function (err){
					console.log (err);
					failAction (err);					
				}
			)
		};

		this.logout = function (beforeAction, afterAction){
			beforeAction ();
			$window.localStorage.removeItem (tokenKey);
			$window.location.href = '/';
			afterAction ();
		};

		this.isLoggedIn = function (){
			this.token = this.getToken ();
			if (this.token){
				this.payload = JSON.parse ($window.atob(this.token.split('.')[1]));
				return this.payload.exp > Date.now () / 1000;
			}	
			else {
				return false
			}
		};

		this.getCurUser = function (){
			if (this.isLoggedIn ()){
				return {
					email: payload.email,
					phone: payload.phone,
					firstname: payload.firstname,
					lastname: payload.lastname,
				}
			}
		};
	}

})();