var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./passport');

var indexRouter = require('./routes/index');
var sellersRouter = require('./routes/sellers');
var customersRouter = require('./routes/customers');
var loginRouter = require('./routes/login');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/api/v1/sellers', sellersRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/login', loginRouter);


module.exports = app;
