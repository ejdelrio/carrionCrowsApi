'use strict';

const expect = require('chai').expect;
const User = require('../model/user.js');
const superagent = require('superagent');

const {url, testUser} = require('./lib/testTemplates.js');
require('../server.js');

describe('Example test', function() {
  describe('POST /api/user', function () {
    describe('With a valid request body', function() {
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(err => done(err));
      })
      it('Should return a json web token and 200 code', done => {
        superagent.post(`${url}/api/user`)
        .send(testUser)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(typeof res.text).to.equal('string');
          done()
        })
      })
    })
    describe('With an invalid request body', function() {
      it('It should return a 400 error code', done => {
        superagent.post(`${url}/api/user`)
        .send({})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        })
      })
    })
    describe('With a duplicate user', function () {
      before(done => {
        new User(testUser)
        .encrypt(testUser.passWord)
        .then(user => user.save())
        .then(() => done())
        .catch(err => done(err));
      });

      after(done => {
        User.remove({})
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 400 error code', done => {
        superagent.post(`${url}/api/user`)
        .send(testUser)
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        })
      })
    })
  })
});