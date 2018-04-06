const UserModule = require('./users');
const ChatModule = require('./chats');
const WorkspaceModule = require('./workspaces');
const SocketConfig = require('./socket');

module.exports = {
  UserModule: UserModule,
  ChatModule: ChatModule,
  SocketConfig: SocketConfig,
  WorkspaceModule: WorkspaceModule
};