var mongoose = require('mongoose');
var User = mongoose.model('User');

console.log('[app] [controller] users');

function UsersController () {

}

module.exports = new UsersController();