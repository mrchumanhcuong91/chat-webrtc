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

    //parse
    var data = JSON.parse(msg.data);
    console.log("Receive new message !!! "+ data.type + "; ");

    switch (data.type){
        case "login":
            handleLogin(data.success);
            break;

        case "offer":
            console.log("data offer : "+ data.offer);
            handleOffer(data.offer, data.name);
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
var msgInput = document.querySelector('#msgInput');
var callPage = document.querySelector('#callPage');
var loginPage = document.querySelector('#loginPage');
loginBtn.addEventListener("click",function(event){
        var text = usernameInput.value;
        userConnected = text;
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
        //onicecandidate
        yourConn.onicecandidate = function(event){
            if(event.candidate){
                send({type: "candidate",
                    candidate: event.candidate});
            }
        };
        //create data channel
        dataChannel = yourConn.createDataChannel("channel1",{reliable: true});
        dataChannel.onerror = function(error){
            console.log("Opps ... Error" + error);
        };
        //onmessage when receive message on channel
        dataChannel.onmessage = function(event){
            var content = JSON.parse(event);
            var name = content.name;
            var message = content.message;
            chatArea.innerHtml += name + ": " + message +"<br>";
        }
        dataChannel.onclose = function(){
            console.log("Onclose session !!!");
        }
    }else
        alert("Login failed. Pls try again !!!")
}
//handle offer function
function handleOffer(offer, name){
    userConnected = name;
    yourConn.setRemoteDescription(new RTCSessionDescription(offer));
    yourConn.createAnswer(function(answer){
        yourConn.setLocalDescription(answer);
        send({type: "answer",
            answer: answer});
    },function(error){
        alert("send answer error" + error);
    });
};
//send message
sendBtn.addEventListener("click", function(){
    var contentChat = msgInput.value;
    dataChannel.send({
        name: userConnected,
        message: contentChat
    });

});
