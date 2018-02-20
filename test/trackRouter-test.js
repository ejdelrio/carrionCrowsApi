'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const {url, testUser, testAlbum} = require('./lib/testTemplates');
const helper = require('./lib/helper');
const {createUser, createModel, clearDB} = helper;
const Album = require('../model/album');
var trackData;

require('../server.js');

describe('Track Router Test', function() {
  before(done => {
    createUser(testUser)
    .then(() => createModel('testAlbum', Album, testAlbum))
    .then(() => done())
    .catch(err => done(err));
  })
  after(done => {
    clearDB()
    .then(() => done())
    .catch(err => done(err));
  })

  describe('POST /api/track/:albumId', function() {
    describe('With valid credentials and a valid file', function() {

      it('Should return a track object and 200 status code', done => {
        superagent.post(`${url}/api/track/${helper.models.testAlbum._id}`)
        .attach('soundFile', './assets/test.mp3')
        .field('name', 'testTrack')
        .field('url', `${url}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        })
      })
    })
  })
})