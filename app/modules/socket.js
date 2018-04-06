
const http = require('http');

const { saveMessage } = require('./chats');
const Config = require('../../config');


module.exports = function (app) {
  const server = http.createServer(app);
  const io = require('socket.io')(server);
  server.listen(Config.app.socketPort);

  console.log(`========== Socket Server opened at  at port ${Config.app.socketPort} ==========`);

  io.on('connection', client => {
    console.log('========== Socket Server connected ==========');
    client.on('message', recieveMessageHandler);
    client.on('disconnect', disconnectHandler);
  });

  const recieveMessageHandler = (data) => {
    console.log('Message reveiced: ', data);
    saveMessage(data)
      .then(result => io.emit('message.new', result))
      .catch(err => console.log(err));
  }

  const disconnectHandler = () => {
    console.log('============ Socket server disconnected ============')
  }

  
}