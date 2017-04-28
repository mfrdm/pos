(function () {
	angular
		.module ('posApp')
		.factory ('socket', [socket]);

	function socket () {
		var socket = io();
		return {
			emit:function(eventName, msg){
				socket.emit(eventName, msg)
			},
			on:function(eventName, func){
				socket.on(eventName, func)
			},
			broadcast: function(eventName, msg){
				socket.broadcast.emit(eventName, msg)
			},
			broadcastTo: function(id, eventName, msg){
				socket.broadcast.to(id).emit(eventName, msg)
			}
		}
	}

})();