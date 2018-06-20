var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var playerRouter = require('./routes/player');
var coachRouter = require('./routes/coach');
var taskRouter = require('./routes/task');
var bodyParser = require('body-parser');

var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var url = "mongodb://localhost:27017/local";
mongoose.Promise = global.Promise
mongoose.connect(url, function(err) {

    if (err) throw err;

    console.log('Successfully connected');

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json({ limit: '100mb' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/player', playerRouter);
app.use('/coach', coachRouter);
app.use('/task', taskRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
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

module.exports = app;