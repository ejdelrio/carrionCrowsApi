'use strict';

const debug = require('debug')('ccApp: userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
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

  return new Promise((resolve, reject) => {
    bcrypt.hash(passWord, 10, (err, hash) => {
      if(err) reject(err);
      this.passWord = hash;
      resolve(this);
    })
  });
};

User.prototype.login = function(passWord) {
  debug('User Compare Method');

  return new Promise((resolve, reject) => {
    bcrypt.compare(passWord, this.passWord, (err, valid) => {
      if(err) reject(err);
      if(!valid) reject(createError(401, 'Access Denied :('));
      resolve(this);
    })
  });
};

User.prototype.generateHash = function() {
  debug('User Generate Hash Method');
  let tries = 0;


  return new Promise((resolve, reject) => {
    _generateHash.call(this);

    function _generateHash() {
      this.hash = crypto.randomBytes(32).toString('hex');

      this.save()
      .then(() => resolve(this.hash))
      .catch(err => {
        if(tries > 3) reject(createError(err));
        tries++;
        return _generateHash.call(this);
      })
    }
  
  });
};

User.prototype.signHash = function(hash) {
  debug('User Sign Hash Method');

  return new Promise((resolve, reject) => {
    this.generateToken()
    .then(hash => resolve(jwt.sign({token: hash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};