var list_player = [];
var isMaster = false;
var uri = "";

exports.blindtest_index = function(req, res, next) {
    res.render('blindtest');
};


exports.blindtest_player = function(req, res, next) {
    res.redirect('/blindtest/player/' + req.body.name);
};


exports.blindtest_player_name = function(req, res, next) {
    res.render('player', {name: req.params.name});
};

exports.blindtest_master = function(req, res, next) {
    if (isMaster)
        res.redirect("/blindtest");
    isMaster = true;
    res.render('master');
};

const stream = require('youtube-audio-stream');
//stream.setKey('AIzaSyBuRi-XPZ5xFKBDC4F86IJsStlcsSRbpvc');


exports.blindtest_audio_stream = (req, res, next) => {
  stream(uri).pipe(res);
};



exports.respond = (socket, io) => {

    socket.on('buzz', (name) => {
        io.emit('buzz', name);
    });

    socket.on('unlockBuzzer', () => {
        io.emit('unlockBuzzer');
    });

    socket.on('scoreUpdate', (pl) => {
        list_player.some((player) => {
            if (player.name == pl.name) {
                player.score += parseInt(pl.score);
                return true;
            }
            return false;
        });
        console.log(list_player);
        io.emit('playerUpdate', list_player);
    });

    socket.on('playerConnect', (player) => {
        if (player != null)
            list_player.push({name:player, score:0});
        io.emit('playerUpdate', list_player);
    });

    socket.on('playerDisconnect', (player) => {
        var index = -1;
        for (let i = 0; i < list_player.length; i++) {
            if(list_player[i].name == player) {
                index = i;
                break;
            }   
        }
        if (index > -1) 
            list_player.splice(index, 1);
        
        io.emit('playerUpdate', list_player);
        
    });

    socket.on('masterDisconnect', () => {
        isMaster = false;
    });


    // GESTION VIDEO YYT
    socket.on('ytlink', (link) => {
        uri = link;
        io.emit('ytlink', link);
    });

    socket.on('ytpause', () => {
        io.emit('ytpause');
    }); 
    
    socket.on('ytplay', () => {
        io.emit('ytplay');
    });

    socket.on('syncMusic', (time) => {
        socket.broadcast.emit('syncMusic', time);
    });
};