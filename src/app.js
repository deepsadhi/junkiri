/**
 * Junkiri: Wireless electrical switch
 * @module app
 * @author Deepak Adhikari <deeps.adhi@gmail.com>
 */
var hbs = require('hbs');
var path = require('path');
var flash = require('flash');
var webSocket = require('ws');
var logger = require('morgan');
var express = require('express');
var config = require('../config');
var home = require('./routes/home');
var admin = require('./routes/admin');
var bodyParser = require('body-parser');
var auth = require('./controllers/auth');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var socket = require('./controllers/socket');
var methodOverride = require('method-override')


var app = express();

app.use(session({
  resave: false,
  secret: 'tXzppdPHu2',
  saveUninitialized: true,
}));
app.use(flash());

app.use(methodOverride('_method'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/admin/partials');
hbs.registerHelper('ifEq', function(v1, v2, options) {
  if(v1 == v2) {
    return options.fn(this);
  }

  return options.inverse(this);
});

hbs.registerHelper('ifIn', function(elem, list, options) {
  if(list.indexOf(elem) > -1) {
    return options.fn(this);
  }

  return options.inverse(this);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

hbs.registerHelper('shift', function(context) {
  return context.shift();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', home);
app.use('/admin', [auth], admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Module dependencies.
var debug = require('debug')('app:server');
var http = require('http');

// Get port from environment and store in Express.
app.set('port', config.server.port);

// Create HTTP server.
var server = http.createServer(app);

// Create WebSocket server
var wsServer = new webSocket.Server({server: server});
socket(wsServer);

// Listen on provided port, on all network interfaces.
server.listen(config.server.port, config.server.host);

module.exports = {
  app: app,
  server: server,
};
