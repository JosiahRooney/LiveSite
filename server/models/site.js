console.log('[app] [model] site');
var mongoose = require('mongoose');

var SiteSchema = new mongoose.Schema({
	name: String,
	link: String,
	health: String,
	package: Boolean,
	robots: Boolean,
	lastModified: Date
});

var Site = mongoose.model('Site', SiteSchema);