'use strict';

const Router = require('express');
const debug = require('debug')('ccApp: Band Member Router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const bearerAuth = require('../lib/bearer');
const BandMember = require('../model/bandMember');
const bandMemberRouter = module.exports = new Router();

bandMemberRouter.get('/api/bandMember', function(req, res, next) {
  debug('GET /api/bandMember');

  BandMember.find({})
  .then(allMembers => res.json(allMembers))
  .catch(err => next(err));
});