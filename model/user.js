'use strict';

const debug = require('debug')('ccApp: userModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const createError = require('http-errors');
const {Schema} = mongoose;

const userSchema = new Schema({
  userName: {type: 'string', unique: true, required: true},
  email: {type: 'string', required: true, unique: true},
  passWord: {type: 'string', required: true},
  hash: {type: 'string', unique: true}
});

userSchema.methods.encrypt = function(passWord) {
  debug('User Encrypt Method');

  return new Promise((resolve, reject) => {
    bcrypt.hash(passWord, 10, (err, hash) => {
      if(err) reject(err);
      this.passWord = hash;
      resolve(this);
    })
  });
};

userSchema.methods.login = function(passWord) {
  debug('User Compare Method');

  return new Promise((resolve, reject) => {
    bcrypt.compare(passWord, this.passWord, (err, valid) => {
      if(err) reject(err);
      if(!valid) reject(createError(401, 'Access Denied :('));
      resolve(this);
    })
  });
};

userSchema.methods.generateHash = function() {
  debug('User Generate Hash Method');
  let tries = 0;


  return new Promise((resolve, reject) => {
    _generateHash.call(this);

    function _generateHash() {
      this.hash = crypto.randomBytes(32).toString('hex');
      console.log('CURRENT_USER: ', this);
      console.log('\nNUMBER_OF_TRIES: ', tries);
      console.log('\n-----------------\n')

      this.save()
      .then(() => resolve(this.hash))
      .catch(err => {
        if(tries > 2) return reject(createError(err));
        tries++;
        return _generateHash.call(this);
      })
    }
  
  });
};

userSchema.methods.signHash = function() {
  debug('User Sign Hash Method');
  let currentUser = this;

  return new Promise((resolve, reject) => {
    currentUser.generateHash()
    .then(hash => resolve(jwt.sign({token: hash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

const User = module.exports = mongoose.model('user', userSchema);