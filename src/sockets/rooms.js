class Rooms {
  constructor() {
    this.roomList = [];
    this.saveRoom = this.saveRoom.bind(this);
  }
  saveRoom(roomName, room) {
    this.roomList[roomName] = room;
  }
  getRoom(roomName) {
    for (var i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].name == roomName) {
        return this.roomList[i];
      }
    }
    var newRoom = new Room(roomName);
    this.roomList.push(newRoom);
    return newRoom;
  }
  join(roomName, personName, ws) {
    var someRoom = this.getRoom(roomName);
    someRoom.saveSocket(personName, ws);
    someRoom.debugPrint();
  }
  remove(ws) {
    for (var i = 0; i < this.roomList.length; i++) {
      var eachRoom = this.roomList[i];
      var socketKeys = Object.keys(eachRoom.socketList);
      if (!socketKeys.length) { return; } //undefined, 0.
      for (var j = 0; j < socketKeys.length; j++) {
        var eachSocket = eachRoom.socketList[socketKeys[j]];
        if (eachSocket.id === ws.id) {
          console.log("FOUND THE SOCKET TRYING TO LEAVE");
          delete eachRoom.socketList[socketKeys[j]];
        }
      }
    }
  }
}

class Room {
  constructor(name) {
    this.name = name;
    this.socketList = {};
    this.messageList = [];
    this.saveSocket = this.saveSocket.bind(this);
    this.saveMessage = this.saveMessage.bind(this);
  }
  saveSocket(userName, socket) {
    this.socketList[userName] = socket;
  }
  broadcast(spec) {
    var userName = spec.name;
    var message = spec.message;
    var token = spec.token;
    for (var key in this.socketList) {
      if (!this.socketList.hasOwnProperty(key)) continue;
      var ws = this.socketList[key];
      var payload = {};
      payload["actionType"] = 'messageBroadcast';
      payload["actionSpec"] = JSON.stringify(spec);
      console.log("now sending payload:", payload, "to room:", this.name);
      ws.send(JSON.stringify(payload));
    }
  }
  saveMessage(spec) {
    console.log("saveMessage");
    this.messageList.push(spec);
    this.broadcast(spec);
  }
  sync(isPlaying, timestamp) {
    for (var key in this.socketList) {
      if (!this.socketList.hasOwnProperty(key)) continue;
      var ws = this.socketList[key];
      var payload = {};
      payload["actionType"] = 'syncBroadcast';
      var actionSpec = {};
      actionSpec["playing"] = isPlaying;
      actionSpec["timestamp"] = timestamp;
      payload["actionSpec"] = JSON.stringify(actionSpec);
      ws.send(JSON.stringify(payload));
    }
  }
  debugPrint() {
    console.log("room", this.name, "has", this.socketList.size, "sockets.");
    console.log("room", this.name, "has", this.messageList.length, "messages.");
  }
}
var rooms = new Rooms();
module.exports = rooms;