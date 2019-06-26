class Clients {
  constructor() {
    this.clientList = {}
    this.saveClient = this.saveClient.bind(this);
  }
  saveClient(userName, client) {
    this.clientList[userName] = client;
  }
}
module.exports = new Clients();