var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var sellersRouter = require('./routes/sellers');
var customersRouter = require('./routes/customers');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/sellers', sellersRouter);
app.use('/api/v1/customers', customersRouter);

//Set up MongoDB configuration
const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb://localhost/test')
console.log("Connecting to database %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;
