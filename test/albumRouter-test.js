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
          helper.models.testAlbum = res.body;
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
  describe('GET /api/album', function() {
    it('Should return an album and a 200 status code', done => {
      superagent.get(`${url}/api/album`)
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        let {name, genre} = res.body.pop();
        expect(name).to.equal(testAlbum.name);
        expect(genre).to.equal(testAlbum.genre);
        done();
      });
    });
  });
  describe('PUT /api/album', function() {
    describe('With a valid object id and valid credentials', function() {
      it('Should return a modified object and 200 status code', done => {
        superagent.put(`${url}/api/album/${helper.models.testAlbum._id}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send({name: 'second album'})
        .end((err, res) => {
          if(err) return done(err);
          let {name, genre} = res.body;
          expect(res.status).to.equal(200);
          expect(name).to.not.equal(testAlbum.name);
          expect(genre).to.equal(testAlbum.genre);
          done();
        });
      });
    });
    describe('With a invalid object id and valid credentials', function() {
      it('Should return a modified object and 200 status code', done => {
        superagent.put(`${url}/api/album/${1234}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send({name: 'second album'})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });

    describe('With a invalid object id and invalid credentials', function() {
      it('Should return a modified object and 200 status code', done => {
        superagent.put(`${url}/api/album/${1234}`)
        .set('Authorization', `Bearer ${1234}`)
        .send({name: 'second album'})
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });
  describe('DELETE /api/album', function() {
    describe('With valid credentials and object id', function() {
      it('Should return a 200 status code', done => {
        superagent.delete(`${url}/api/album/${helper.models.testAlbum._id}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('With valid credentials and an invalid object id', function() {
      it('Should return a 400 error code', done => {
        superagent.delete(`${url}/api/album/${helper.models.testAlbum._id}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
    describe('With invalid credentials and an invalid object id', function() {
      it('Should return a 401 error code', done => {
        superagent.delete(`${url}/api/album/${helper.models.testAlbum._id}`)
        .set('Authorization', `Bearer ${1234}`)
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
  });
});