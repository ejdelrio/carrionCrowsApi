'use strict';

const debug = require('debug')('ccApp: userModel');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
  userName: {type: 'string', unique: true, required: true},
  email: {type: 'string', required: true, unique: true},
  passWord: {type: 'string', required: true},
  hash: {type: 'string', unique: true}
});

const User = module.exports = mongoose.model('user', userSchema);

User.prototype.encrypt = function(passWord) {
  debug('User Encrypt Method');
};

User.prototype.login = function(passWord) {
  debug('User Compare Method');
};

User.prototype.generateHash = function() {
  debug('User Generate Hash Method');
}

User.prototype.signHash = function(hash) {
  debug('User Sign Hash Method');
}