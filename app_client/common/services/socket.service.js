(function () {
	angular
		.module ('posApp')
		.factory ('socket', [socket]);

	function socket () {
		var socket = io.connect('localhost:3000');

		return{
			on:function(eventName, callback){
				socket.on(eventName, callback);
			},
			emit:function(eventName, data){
				socket.emit(eventName, data);
			}
		}
	}
})();