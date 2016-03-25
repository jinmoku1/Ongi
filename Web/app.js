/**
 * This is the module that is executed to run the whole application. This module sets up the express framework
 * and basic server configurations, and starts the routing.
 *
 * @module app
 */

var express = require('express');
var http = require('http');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('express-logger');
var favicon = require('express-favicon');
var bodyParser = require('body-parser');
var errorHandler = require('express-error-handler');


// extended requirement
var router = require('./router');

var app = express();

// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// using express session
app.use(cookieParser());
app.use(session({
	secret: '8qh)osf8!92hx*#ljbj0@#',
	resave: true,
    saveUninitialized: false
}));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger({path: __dirname + "/logfile.txt"}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// disable view cache
app.disable('view cache');

// begin routing
router.route(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
