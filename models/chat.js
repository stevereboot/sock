// models/chat.js

var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// Define Schema
var schema = new mongoose.Schema({
	msg: mongoose.Schema.Types.Mixed,
});

// Define model
model = mongoose.model('Chat', schema);

module.exports = model;