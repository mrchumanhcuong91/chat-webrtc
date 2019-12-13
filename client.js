//connect to websocket and process data
//connect to server
// ws object
var userConnected;
var yourConn;
var dataChannel;
//const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9090/Websocket/actions');
//ws.on('open', function open() {
//  ws.send('something');
//});
ws.onopen = function(){
    console.log("Connect to server");
}
//when got a message from server
ws.onmessage = function(msg){
    console.log("Receive new message !!! "+ msg);

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
var usernameInput = document.querySelector('#usernameInput');
var loginBtn = document.querySelector('#loginBtn');
var chatArea = document.querySelector('#chatarea');
var sendBtn = document.querySelector('#sendMsgBtn');
var callPage = document.querySelector('#callPage');
var loginPage = document.querySelector('#loginPage');
loginBtn.addEventListener("click",function(event){
        var text = usernameInput.value;
        console.log("text :" +text);
        var data = {type: "login",
                    name: text};
        send(data);
    }
    )

//click login and receive login results
function handleLogin(success){
    if(success){
        //show chat window
        //alert("Login Success!!!")
        //open tab chat and send btn
        loginPage.style.display = "none";
        chatArea.style.display = "block";
        //create RTC channel
        //configure address
        var configuration = {
            "iceServer": [{"url": "stun:stun2.1.google.com:19302"}]
        };
        //create rtc object
        yourConn = new webkitRTCPeerConnection(configuration,{optional: [{RtpDataChannels: true}]});
        //create data channel
        dataChannel = yourConn.createDataChannel("channel1",{reliable: true});
        dataChannel.onerror = function(error){
            console.log("Opps ... Error" + error);
        };
        //onmessage when receive message on channel
        dataChannel.onmessage = function(event){

        }
    }else
        alert("Login failed. Pls try again !!!")
}















