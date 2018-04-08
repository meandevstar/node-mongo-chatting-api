
const http = require('http');

const { saveMessage } = require('./chats');
const Config = require('../../config');


module.exports = function (app) {
  const server = http.createServer(app);
  const io = require('socket.io')(server);
  server.listen(Config.app.socketPort);

  console.log(`========== Socket Server opened at port ${Config.app.socketPort} ==========`);

  io.on('connection', client => {
    console.log('========== Socket Server connected ==========');
    client.on('messages', recieveMessageHandler);
    client.on('users.logout', (data) => {console.log('====> Socket logout data: ', data)});
    client.on('users.login', (data) => {console.log('====> Socket login data: ', data)});
    client.on('disconnect', disconnectHandler);
  });

  const recieveMessageHandler = (data) => {
    console.log('========== Message reveiced ==========');
    console.log(`Channel: ${data.room}\nSender: ${data.sender}\nText: ${data.text}`);
    saveMessage(data)
      .then(result => io.emit('messages.new', result))
      .catch(err => console.log(err));
  }

  const disconnectHandler = () => {
    console.log('============ Socket server disconnected ============')
  }

  
}