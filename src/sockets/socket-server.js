const WebSocket = require('ws');
const wss = new WebSocket.Server({ 
  port: 8088,
  clientTracking: true 
});
const rooms = require('./rooms')

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(json) {
    //console.log(' ws on message', json);
    var payload = JSON.parse(json);
    var actionType = payload.actionType;
    var actionSpec = payload.actionSpec;
    switch (actionType) {
      case 'join':
        rooms.join(actionSpec.room, actionSpec.name, ws)
        console.log(actionSpec.name, 'joined room:', actionSpec.room);
        break;
      case 'message':
        var room = rooms.getRoom(actionSpec.room);
        if (room) {
          room.saveMessage(actionSpec); 
        }
        break;
      case 'sync':
        var room = rooms.getRoom(actionSpec.room);
        if (room) {
          room.sync(actionSpec.playing, actionSpec.timestamp)
          console.log(
            'timestamp:', actionSpec.timestamp, 
            'playing:', actionSpec.playing,
            'in room:', room.name);
        } else {
          console.log("room not found");
          console.log(payload);
        }
        break;
      default: console.log("actionType: ", actionType)
    }
  });
  ws.onclose = function (e) {
    rooms.remove(ws);
  }
});

wss.on('onclose', function connection(ws) {
  //TODO: remove all ws from clients...
  console.log("server onclose:");
});


