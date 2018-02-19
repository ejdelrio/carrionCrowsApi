'use strict';

const User = require('../../model/user.js');
const BandMember = require('../../model/bandMember.js');
const debug = require('debug')('ccApp: Test Helper');

const helper = module.exports = {};

helper.users = {};
helper.tokens = {};
helper.models = {};

helper.createUser = function(userObject) {
  debug('create user');
  var output;
  let {userName, passWord} = userObject;
  return new Promise((resolve, reject) => {
    new User(userObject)
    .encrypt(passWord)
    .then(user => {
      helper.users[userName] = user;
      output = user;
      return user;
    })
    .then(user => user.signHash())
    .then(token => helper.tokens[userName] = token)
    .then(() => resolve(output))
    .catch(err => reject(err));
  });
};

helper.createModel = function(modelName, Model, testModel) {
  debug('Create Model');

  return new Promise((resolve, reject) => {
    new Model(testModel)
    .save()
    .then(model => {
      helper.models[modelName] = model;
      resolve(model);
    })
    .catch(err => reject(err));
  })
}

helper.clearDB = function() {
  debug('clearDB');
  helper.users = {};
  helper.tokens = {};
  helper.models = {};

  return Promise.all([
    User.remove({}),
    BandMember.remove({})
  ]);
};