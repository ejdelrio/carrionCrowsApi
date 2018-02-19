'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const {url, testUser, testAlbum} = require('./lib/testTemplates');
const helper = require('./lib/helper');
const {createUser, createModel, clearDB} = helper;

require('../server.js');

describe('Album Router Test', function() {
  before(done => {
    createUser(testUser)
    .then(() => done())
    .catch(err => done(err));
  });

  after(done => {
    clearDB()
    .then(() => done())
    .catch(err => done(err));
  })
  describe('POST /api/album', function() {
    describe('With a valid request body and valid credentials', function() {

      it('Should return an album and a 200 status code', done => {
        superagent.post(`${url}/api/album`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send(testAlbum)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testAlbum.name);
          expect(res.body.genre).to.equal(testAlbum.genre);
          done();
        });
      });
    });
    describe('With a invalid request body and valid credentials', function() {

      it('Should a 400 error code', done => {
        superagent.post(`${url}/api/album`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send({})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
    describe('With a invalid request body and invalid credentials', function() {

      it('Should a 401 error code', done => {
        superagent.post(`${url}/api/album`)
        .set('Authorization', `Bearer ${1234}`)
        .send({})
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });
});