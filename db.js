//Set up MongoDB configuration
const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL || 'mongodb+srv://uservice:bJkmYnGtW0yvWvbQ@cluster0.v9zlcdz.mongodb.net/?retryWrites=true&w=majority');
console.log("Connecting to database %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = db;