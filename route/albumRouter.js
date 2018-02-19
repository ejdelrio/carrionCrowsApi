'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('ccApp: album Router');

const Album = require('../model/album');
const bearerAuth = require('../lib/bearer.js');
const albumRouter = module.exports = new Router();

albumRouter.post('/api/album', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST /api/album');

  new Album(req.body)
  .save()
  .then(album => res.json(album))
  .catch(err => next(createError(400, err.message)));
});