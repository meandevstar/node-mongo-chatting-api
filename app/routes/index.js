
var userRoutes = require('./users');
var messageRoutes = require('./chats');

module.exports = (app) => {
  userRoutes(app);
  messageRoutes(app);
};