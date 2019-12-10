//connect to websocket and process data
//connect to server
// ws object
var userConnected;
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9090/Websocket/actions');
//ws.on('open', function open() {
//  ws.send('something');
//});
ws.onopen = function(){
    console.log("Connect to server");
}
//when got a message from server
ws.onmessage = function(msg){
    console.log("Receive new message !!!");

    //parse
    var data = JSON.parse(msg.data);

    switch (data.type){
        case "login":
            handleLogin(data.success);
            break;

        case "offer":
            handleOffer(msg);
            break;

        case "answer":
            handleAnswer(msg);
            break;

        case "candidate":
            handleCandidate(msg);
            break;

        case "leave":
            handleLeave(msg);
            break;

        default:
            break;

    }
};
function send(message){
    if(userConnected){
        message.name = userConnected;
    }
    ws.send(JSON.stringify(message));

}
//click login and receive login results
function handleLogin(success){
    if(success)
        //show chat window
    else
        alert("Login failed. Pls try again !!!")
}















