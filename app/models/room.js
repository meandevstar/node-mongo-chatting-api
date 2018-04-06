// grab the mongoose module
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const roomSchema = mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  title: String,
});

roomSchema.plugin(timestamps);

module.exports = mongoose.model('rooms', roomSchema);
