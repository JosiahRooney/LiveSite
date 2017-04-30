var mongoose = require( 'mongoose' ),
    express  = require( 'express' ),
	request  = require( 'request' ),
    bp       = require( 'body-parser' ),
    path     = require( 'path' ),
    root     = __dirname,
    port     = process.env.PORT || 8000,
    app      = express();

app.use( bp.json({ extended: true }));
app.use( express.static( path.join( root, 'client' )));
app.use( express.static( path.join( root, 'bower_components' )));

require('./server/config/mongoose.js');

var Site = mongoose.model('Site');

var routes = require('./server/config/routes.js');
    routes(app);

app.listen( port, function() {
  console.log( `server running on port ${ port }` );
});