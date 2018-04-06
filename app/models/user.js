// grab the mongoose module
const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

const userSchema = mongoose.Schema({
	name : String,
	email: String,
	password: String
});

userSchema.plugin(timestamps);

module.exports = mongoose.model('users', userSchema);
