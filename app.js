require('dotenv').load();

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    uglifyJs = require("uglify-js"),
    app = express(),
    passport = require('passport'),
    session = require('express-session');

//Connect database
require('./app_api/models/db');
//Config passport for authenticating
require('./app_api/config/passport')(passport);

//Routes
var routes = require('./app_server/routes/index'),
	routesApi = require('./app_api/routes/index');

var http = require('http');

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

//Log, bodyparser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

//Session, initialize
app.use(session({ secret: 'anythingyouwanttotype' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//Use routes
app.use('/', routes);
app.use('/api', routesApi);

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
  res.render('error', {
    data: {
			user:{

			},
			look: {
				title: "Error",
				css: [''], // FIX: add name         
			},
		}
	});
});

module.exports = app;
