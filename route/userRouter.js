'use strict';

const Router = require('express').Router;
const debug = require('debug')('ccApp: User Router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const basicAuth = require('../lib/basic.js');
const User = require('../model/user.js');
const userRouter = module.exports = new Router();

userRouter.post('/api/user', jsonParser, function(req, res, next) {
  debug('POST /api/user');

  let {passWord} = req.body;
  delete req.body.passWord;

  let newUser = new User(req.body);
  
  newUser.encrypt(passWord)
  .then(user => user.save())
  .then(user => user.signHash())
  .then(token => {
    res.send(token);
    res.end();
    next();
  })
  .catch(err => next(createError(400, err)));
});

userRouter.get('/api/user', basicAuth, function(req, res, next) {
  debug('GET /api/user');

  let {passWord} = req.auth;
  delete req.auth.passWord;

  User.findOne(req.auth)
  .then(user => {
    console.log('__USER__: ', user, '\n');
    return user.login(passWord)
  })
  .then(user => user.generateHash())
  .then(token => {
    console.log('__TOKEN__', token)
    res.send(token);
    res.end();
    next();
  })
  .catch(err => next(createError(err, 400)));

  next();
})