'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const User = require('../model/user.js');
const helper = require('./lib/helper.js');
const {url, testUser} = require('./lib/testTemplates.js');
const {createUser, clearDB} = helper;
require('../server.js');

describe('Example test', function() {
  describe('POST /api/user', function () {
    describe('With a valid request body', function() {
      after(done => {
        clearDB()
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
        .then(user => user.signHash())
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
  describe('GET /api/user', function() {
    before(done => {
      new User(testUser)
      .encrypt(testUser.passWord)
      .then(user => user.save())
      .then(() => done())
      .catch(err => done(err));
    })

    after(done => {
      clearDB({})
      .then(() => done())
      .catch(err => done(err));
    })

    describe('With valid credentials', function() {
      it('Should return a 200 status code and a json web token', done => {
        superagent.get(`${url}/api/user`)
        .auth(testUser.userName, testUser.passWord)
        .end((err, res) => {
          if(err) return done(err);
          done();
        })
      })
    })

    describe('With invalid credentials', function() {
      it('Should return a 401 error code', done => {
        superagent.get(`${url}/api/user`)
        .auth('invalid', 'invalid')
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })
  })
});