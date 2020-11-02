var express = require('express');
var router = express.Router();



var blindtest_controller = require('../controllers/blindtestController');



/* GET users listing. */
router.get('/', blindtest_controller.blindtest_index);

router.post('/player/', blindtest_controller.blindtest_player)
router.get('/player/:name', blindtest_controller.blindtest_player_name);


router.get('/master', blindtest_controller.blindtest_master);
router.get('/audio', blindtest_controller.blindtest_audio_stream);

module.exports = router;
