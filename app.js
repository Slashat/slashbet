/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.configure('production', function(){
    app.use(express.errorHandler());
});

// development only
app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});


app.use(express.static(__dirname + '/public'));

var auth = require('./lib/auth');
app.use(auth);

var main = require('./lib/main');
app.use(main);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});