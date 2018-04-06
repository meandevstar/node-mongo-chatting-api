// grab the mongoose module
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const messageSchema = new mongoose.Schema({
	room : { type: mongoose.Schema.Types.ObjectId, ref: 'rooms' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  text: String
});

messageSchema.plugin(timestamps);

module.exports = mongoose.model('messages', messageSchema);
