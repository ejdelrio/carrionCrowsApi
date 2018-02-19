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

bandMemberRouter.post('/api/bandMember', jsonParser, bearerAuth, function(req, res, next) {
  debug('POST /api/bandMember');

  console.log(req.body);
  new BandMember(req.body)
  .save()
  .then(member => res.json(member))
  .catch(err => next(createError(400, err)));
});

bandMemberRouter.put('/api/bandMember/:_id', jsonParser, bearerAuth, function(req, res, next) {
  debug('POST /api/bandMember');

  BandMember
  .findByIdAndUpdate(req.params._id, req.body, {new: true})
  .then(member => res.json(member))
  .catch(err => next(createError(404, 'Object id not found')));
});

bandMemberRouter.delete('/api/bandMember/:_id', jsonParser, bearerAuth, function(req, res, next) {
  debug('DELETE /api/bandMember');

  BandMember
  .findByIdAndRemove(req.params._id)
  .then(() => res.end())
  .catch(err => next(createError(404, 'Object id not found')));
})