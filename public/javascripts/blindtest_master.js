
gapi.load("client", loadClient);

function loadClient() {
    gapi.client.setApiKey("AIzaSyBuRi-XPZ5xFKBDC4F86IJsStlcsSRbpvc");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}

unlock_buzzer = () =>{
    socket.emit('unlockBuzzer');
    socket.emit('ytplay');
};


playytmusic = () => {
    var input = document.getElementById('playytmusicInput');
    var id = input.value.split('=')[1];
    addVideo(id, "Ajouté à la main");
};


addVideo = (id, title) => {
    document.getElementById('playlist').innerHTML += '<div class="card" id="' + id + '">\
    <div class="card-header">\
        ' + title + '\
    </div>\
    <div class="card-body">\
        <img src="http://i3.ytimg.com/vi/' + id +'/hqdefault.jpg" />\
    <button class="btn btn-success" onclick="playVideo(\'' + id + '\')">Jouer la musique</button>\
    <button class="btn btn-danger" onclick="deleteVideo(\'' + id + '\')">Supprimer la musique</button>\
    </div>\
    </div>';
}

playVideo = (id) => {
    var link = "https://www.youtube.com/watch?v=" + id;
    unlock_buzzer();
    socket.emit('ytlink', link);
    setTimeout(syncMusic, 1000);
    document.getElementById(id).className = 'card text-white bg-success';
}

deleteVideo = (id) => {
    document.getElementById(id).remove();
}
 
searchmusic = () => {
    var keyword = document.getElementById('searchmusicInput').value;
    return gapi.client.youtube.search.list({
        "part": [
          "snippet"
        ],
        "maxResults": 25,
        "q": keyword,
        "type": [
          "video"
        ]
      })
    .then(function(response) {
        var output = "";
        response.result.items.forEach(video => {
            var videoId = video.id.videoId;
            var videoTitle = video.snippet.title;
            output += '<div class="card"><div class="card-header">' + videoTitle + '</div><div class="card-body">\
            <img src="http://i3.ytimg.com/vi/' + videoId + '/hqdefault.jpg" /><button class="btn btn-success" \
            onclick="addVideo(\'' + videoId + '\', \'' + videoTitle +'\')">Ajouter</button></div></div>';
        });
        document.getElementById('searchList').innerHTML = output;
    },
    function(err) { console.error("Execute error", err); });
}

syncMusic = () => {
    var time = document.getElementById('audio').currentTime;
    socket.emit('syncMusic', time);
};

window.onbeforeunload = () => {
    socket.emit('masterDisconnect');
}


add_points = () => {
    var points = document.getElementById('addScore').value;
    var player = document.getElementById('playerName').getElementsByTagName('strong')[0].textContent;
    socket.emit('scoreUpdate', {name: player, score: points});
};


socket.on('buzz', (player) => {
    document.getElementById('playerBuzz').hidden = false;
    document.getElementById('playerName').getElementsByTagName('strong')[0].textContent = player;
});

socket.on('unlockBuzzer', () => {
    document.getElementById('playerBuzz').hidden = true;
});