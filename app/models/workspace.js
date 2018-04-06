// grab the mongoose module
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const workspaceSchema = mongoose.Schema({
  name : String,
  displayName: String,
	admin: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
});

workspaceSchema.plugin(timestamps);

module.exports = mongoose.model('workspaces', workspaceSchema);
