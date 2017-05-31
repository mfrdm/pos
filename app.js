require('dotenv').load();

var express = require('express'),
    url = require ('url'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    passport = require('passport'),
    session = require('express-session');

// Connect database
require('./app_api/models/db');
// Config passport for authenticating
require('./app_api/config/passport')(passport);

// Routes
var routes = require('./app_server/routes/index'),
    routesApi = require('./app_api/routes/index');

var http = require('http');

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

// Log, bodyparser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app_client', express.static(path.join(__dirname, 'app_client')));

// Session, initialize
app.use(session({ secret: 'anythingyouwanttotype' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// // Use routes
// var ANGULAR_URLS = ['/checkin', '/bookings', '/login'];
// var angularBaseRoute = '/';
// app.use (function (req, res, next){
    
//     var parts = url.parse (req.url);

//     for (var i=0; i < ANGULAR_URLS.length; i++){
//         if (parts.pathname.indexOf (ANGULAR_URLS[i]) === 0){
//             console.log (ANGULAR_URLS[i], parts.pathname)
//             return res.redirect (angularBaseRoute);
//         }
//     }

//     return next ();
// });

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
    console.log (err)
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = (req.app.get('env') === 'development' || req.app.get('env') === 'test') ? err : {};

    // render the error page
    res.status(err.status || 500);

    res.json ({error: err})

    // if (res.status == 404){
    //     return res.render('error', {
    //         error: err,
    //         data: {
    //             user:{

    //             },
    //             look: {
    //                 title: "Error",
    //                 css: [''], // FIX: add name         
    //             },
    //         }
    //     });       
    // }

    // else {
    //     return res.json ({error: err});
    // }
});

module.exports = app;
