

$(function() {
//setting variables first 
    var currentNick = null;
    var socket = io.connect();
    var $theName = $('#theName');

//function for the scrolling.
    function formCorrect() {

        var heightVal = $('#msgBox').height();

        $('#msgBox').scrollTop($('#msgBox').scrollTop() + heightVal);

}
//getting the write form.
    $('#messageForm').submit(function(){

        socket.emit('chat', $('#userInput').val());

        $('#userInput').val('');
        return false;
    });

//display the history of the message when the user joins 

    socket.on('displayHistory', function(all){

        for(var i = 0; i < all.msg.length; i++){

            $('#messages').append('<li>' + all.t[i] + " "  + all.usr[i] + "</span>" +": " + all.msg[i]);

        }
    });

//updates the name 

    socket.on('nameUpdate', function(count){

        var nameVal = " ";

        for(i = 0; i < count.length; i++){
            
            nameVal = nameVal + '<li class="list-group-item">' + '<b>' + count[i] + '</b>' + '</li>';
        }
        $('#usersConnected').html(nameVal);

    });

//Displays your name on the top
    socket.on('displayYourName', function(name){ 

        $theName.html("Hello, " + name);   
        currentNick = name; 

    });

//main update for the chats.
    socket.on('chat', function(data){

        if(data.usr == currentNick)
        {
            $('#messages').append($('<li><b>' + data.t + '</b>' + '<span style="color:' + data.colour + '">' + 
                           data.usr + " </span><b>" + data.msg + '</b></li>'));   
        }

        else
        {
            $('#messages').append($('<li><b>' + data.t + '</b>' + '<span style="color:' + data.colour + '">' + 
                           data.usr + " </span>" + data.msg + '</li>'));  
        }

        formCorrect();

    });

});

