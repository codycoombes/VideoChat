var express = require('express');
var router = express.Router();
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080');

/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('detail', { title: 'Expression' });
});

ws.on('open', function open() {
  //ws.send('{"userName": "JK", "roomName": "roomba", "message": "bottle"}');
});

ws.on('message', function incoming(data) {
  console.log(data);
});



module.exports = router;
