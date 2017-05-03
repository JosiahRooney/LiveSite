console.log('[app] [mongoose] setup');

//This file is complete other than changing our DB
var mongoose      = require('mongoose'),
    fs            = require('fs'),
    path          = require('path'),
    models_path   = path.join( __dirname, "../models"),
    reg           = new RegExp( ".js$", "i" ),
    dbURI         = 'mongodb://localhost/livesite';

mongoose.connect( dbURI );
mongoose.connection.on( 'connected', function () {
    console.log( '[app] [mongoose] default connection open to',dbURI);
});
mongoose.connection.on( 'error', function ( err ) {
    console.error( '[app] [mongoose] default connection error: ${ err }');
});
mongoose.connection.on( 'disconnected', function () {
    console.log( '[app] [mongoose] default connection disconnected' );
});
process.on( 'SIGINT', function() {
    mongoose.connection.close( function () {
        console.log( '[app] [mongoose] default connection disconnected through app termination' );
        process.exit( 0 );
    });
});
fs.readdirSync( models_path ).forEach( function( file ) {
    if( reg.test( file ) ) {
        require( path.join( models_path, file ) );
    }
});