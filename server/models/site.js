console.log('Site model');
var mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
	name: String,
	link: String
});

var Site = mongoose.model('Site', SiteSchema);