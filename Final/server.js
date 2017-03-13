//Sanha Kim Student ID:10090118. 
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port);
console.log('listening on port', port);

app.use(express.static(__dirname + '/public'));

/*
This creats list of Nicknames, colors for original guest users when they come to webserver. 
The maximum is 7 different users atm. 
created variables. 
*/
    
var listOfColors = ["#32ff3d", "#ff8832", "#31e7ff", "#2c2459", "#b70c78","#3b4759"];
var listOfUsers = ["Bob", "Alex", "Alan", "Simon", "Kevin", "Clare","Merlin"];
timeLog = [];
pastMsg = [];
history = [];
colorsLog = [];

listofConnected = [];

users = [];
colors = [];

/*
function for updating nicknames. This is called quite often, so created function. 

*/
    

function nickUpdates(){
        io.sockets.emit('nameUpdate', users);
    }

io.on('connection', function(socket){

/*
Done Calculations to set up user at the start. gets random user name out of 7, and gets random color
for the nickname too.
*/
    

    let indexName = Math.floor(Math.random()*listOfUsers.length);
    socket.username = listOfUsers[indexName];
    users.push(socket.username);
    listOfUsers.splice(indexName,1);
    socket.emit('displayYourName', socket.username);

    nickUpdates();
    let index = Math.floor(Math.random()*listOfColors.length);
    colors.push(listOfColors[index]);


    socket.emit('displayHistory', {msg:history, usr:pastMsg, t:timeLog} );

    socket.on('disconnect', function(data){
        colors.splice(users.indexOf(socket.username),1);
        users.splice(users.indexOf(socket.username),1);
        nickUpdates();
        listofConnected.splice(listofConnected.indexOf(socket), 1);
    });


/*
This is for sending messages. It checks for /nick and /nickcolor otherwise just sends the message with time stamped. 
*/
        socket.on('chat', function(data){
        
        var times = new Date();
        var time = times.getHours() + ':' + times.getMinutes() + ':' + times.getSeconds();


        if (data.indexOf('/nick') !== -1 && !data.includes('/nickcolor')) {
            let newNick = data.replace('/nick ', '');


            if(users.includes(newNick)){
                data = "The nickname is already taken" + newNick + ", please try another name";
            }

            else{
                users[users.indexOf(socket.username)] = newNick;
                socket.username = newNick;

                nickUpdates();

                data = "SERVER: New Nickname: " + socket.username;

                socket.emit('displayYourName', socket.username);
            }
            
        }
 
        if(data.includes("/nickcolor ")){   
           color = data.replace('/nickcolor ','');
           colors[users.indexOf(socket.username)] = color; 
           data = "new Color for Nickname: " + color;

        }
/*
pushes the value for the time, the history message, the username, and color so that it can be used elsewhere. 
Such as the client.js.
*/
    
        timeLog.push(time);
        pastMsg.push(socket.username);
        history.push(data);
        colorsLog.push(colors[users.indexOf(socket.username)])

//sends the information
        io.sockets.emit('chat', {msg:data, usr:socket.username, t:time, colour:colors[users.indexOf(socket.username)] });
    });
 

});



