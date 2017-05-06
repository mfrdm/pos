// var socketApp = function(server){
// 	var io = require('socket.io')(server)

// 	var list = []
// 	io.on('connection', function(socket){
// 	    console.log('a user connected with id: '+socket.id);
// 	    var userId = socket.id;
// 	    var dict = {}
// 	    socket.on('login', function(msg){
// 	        dict.userId = socket.id;
// 	        dict.firstname = msg.firstname;
// 	        dict.lastname = msg.lastname;
// 	        dict.email = msg.email;
// 	        dict.phone = msg.phone;
// 	        if(dict.firstname == 'tuan'){
// 	        	socket.join('admin')
// 	        }
// 	        list.push(dict);
// 	        console.log(list);
// 	        socket.on('sendNoti', function(msg){
// 	            console.log(userId,' with phone ',dict.phone, '  send  ', msg);
// 	            io.to('admin').emit('handleNoti', {'firstname':dict.firstname, 'msg':msg})
// 	        })
// 	    });
	    
// 	    socket.on('disconnect', function(){
// 	        console.log('user disconnected');
// 	        list = list.filter(function(id){
// 	            return id.userId != socket.id
// 	        })
// 	        console.log(list)
// 	    });
// 	});
// }

// module.exports = socketApp;