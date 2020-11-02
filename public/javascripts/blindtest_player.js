
updateVolume = () => {
    var range = document.getElementById('volumeRange');
    document.getElementById('audio').volume = range.value/100;
}

window.onbeforeunload = () => {
    socket.emit('playerDisconnect', playerName);
}

socket.on('buzz', (player) => {
    document.getElementById('buzzer').disabled = true;
    document.getElementById('playbutton').disabled = true;

    document.getElementById('playerBuzz').hidden = false;
    document.getElementById('playerName').getElementsByTagName('em')[0].textContent = player;

    if (player == playerName) 
        document.getElementById('buzzer').className = 'btn btn-success btn-lg';
    else
        document.getElementById('buzzer').className = 'btn btn-warning btn-lg';
});


socket.on('unlockBuzzer', () => {
    document.getElementById('buzzer').disabled = false;
    document.getElementById('playbutton').disabled = false;

    document.getElementById('playerBuzz').hidden = true;

    document.getElementById('buzzer').className = 'btn btn-info btn-lg';
});

socket.on('syncMusic', (time) => {
    document.getElementById('audio').currentTime = time;
})