//create sever relay signal to each other
//request websocket lib
var WebSocket = require('ws');

//create ws object
var wss = new WebSocket.Server({port:9090});
//list user in room
var users = {};
//now server listen connection
wss.on('connection', function(connection){
  console.log("User connected");
  connection.on('message', function(message){
    var data;
    try {
      data = JSON.parse(message);
    } catch (e) {
      console.log("Invalid JSON");
      data ={};
    }

    switch (data.type) {
      //case message
      case "login":
          console.log("User login");
          if(users[data.name]){
            sendTo(connection,{
                type: "login",
                success: false
            });
          }else {
            users[data.name] = connection;
            connection.name = data.name;
            sendTo(connection, {
              type: "login",
              success: true
            });

          }
      //case offer
      case "offer":
          console.log("send Offer to" + data.name);
          //get coonnection of User A
          var conn = users[data.name]; //user A
          if(conn != null)  {
            connection.otherName = data.name;
            sendTo(connection, {
              type:"offer",
              data: data.offer,
              name: data.name
            });

          }
          break;

      //case answer
	  case "answer":
		console.log("send answer to "+ data.name);
		var conn = users[data.name];
		if(conn != null){
			connection.otherName = data.name;

			sendTo(conn, {
				type: "answer",
				data: data.answer,
				name: data.name
			});
		}
       case "candidate":
           console.log("Candidate income "+ connection.candidate);
           var conn = users[data.name];
           if(conn != null){
               sendTo(conn, {
                      type: "candidate",
                      candidata: data.candidate
                });
           }
           break;

        case "leave":
            console.log(data.name + "leave chat rooms");
            var conn = users[data.name];
            conn.otherName = null;
            if(conn != null){
                sendTo(conn, {type: "leave"});
            }
            break;

        default:
            sendTo(connection, {
               type: "error",
               message: "Command not found: " + data.type
            });

            break;

    }
  })
    connection.on("close", function(){
        if(connection.name){
            delete users[connection.name];

            if(connection.otherName){
                var conn = users[connection.otherName];
                if(conn != null){
                    sendTo(conn, {type: "leave"});
                }
            }
        }


    });
});

function sendTo(connection, message){
  connection.send(JSON.stringify(message));
}
