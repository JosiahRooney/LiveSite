console.log('[app] [model] user');
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	phone: String,
	password_hash: String,
	sites: [],
	lastModified: Date
});

var User = mongoose.model('User', UserSchema);