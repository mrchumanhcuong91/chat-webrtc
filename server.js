//create sever relay signal to each other
//request websocket lib
var WebSocketServer = require('ws').server;

//create ws object
var wss = new WebSocketServer({port:9090});
//list user in room
var users = {};
//now server listen connection
wss.on('connection', function(connection){
  console.log("User connected");
  wss.on('message', function(message){
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
              connection: data.name
            });

          }
          break;

      //case answer

    }
  })
});
function sendTo(connection, message){
  connection.send(JSON.stringify(message));
}
