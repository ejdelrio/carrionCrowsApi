'use strict';

const User = require('../../model/user.js');
const debug = require('debug')('ccApp: Test Helper');

const helper = module.exports = {};

helper.users = {};
helper.tokens = {};
helper.models = {};

helper.createUser = function(userObject) {
  debug('create user');
  let {userName, passWord} = userObject;
  return new Promise((reject, resolve) => {
    new User(userObject)
    .encrypt(passWord)
    .then(user => {
      helper.users[userName] = user;
      return user;
    })
    .then(user => user.signHash())
    .then(token => helper.tokens[userName] = token)
    .then(() => resolve())
    .catch(err => reject(err));
  });
};

helper.clearDB = function() {
  debug('clearDB');
  return Promise.all([
    User.remove({})
  ]);
};