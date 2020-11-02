var playerName = null;



buzz = (name) => {
    socket.emit('ytpause');
    socket.emit('buzz', name);
};

playytvideo = (link) => {
    document.getElementById('audio').load();
    document.getElementById('audio').play();
}




window.onload = () => {
    socket.emit('playerConnect', playerName);
}



// RECEPTION DE SIGNAL

socket.on('playerUpdate', (players) => {
    var table = document.getElementById('players_tab').getElementsByTagName('tbody')[0];
    table.innerHTML = "";
    players.forEach(player => {
        var row = table.insertRow(table.rows.length)
        row.innerHTML = "<tr><td>" + player.name + "</td><td>"+ player.score + "</td></tr>";
    });
});



socket.on('ytlink', (link) => {
    playytvideo(link);
});

socket.on('ytpause', () => {
    document.getElementById('audio').pause();
}); 

socket.on('ytplay', () => {
    document.getElementById('audio').play();
    
});




audioPause = () => {
    socket.emit('ytpause');
};

audioPlay = () => {
    socket.emit('ytplay');
};