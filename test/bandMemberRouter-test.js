'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const BandMember = require('../model/bandMember.js');
const {url, testUser, testBandMember} = require('./lib/testTemplates');
const helper = require('./lib/helper');
const {createUser, clearDB, createModel} = helper;

require('../server.js');

describe('bandMemberRouter Tests', function() {
  before(done => {
    createUser(testUser)
    .then(() => done())
    .catch(err => done(err));
  })

  after(done => {
    clearDB()
    .then(() => done())
    .catch(err => done(err))
  })
  describe('GET /api/bandMember', function() {
    before(done => {
      createModel('bandMember', BandMember, testBandMember)
      .then(() => done())
      .catch(err => done(err));
    })

    after(done => {
      helper.models = {};
      BandMember.remove({})
      .then(() => done())
      .catch(err => done(err));
    })

    it('Should return an array of band member models', done => {
      superagent.get(`${url}/api/bandMember`)
      .end((err, res) => {
        if(err) return done(err);
        expect(Array.isArray(res.body)).to.equal(true);
        let resMember = res.body[0];
        expect(resMember.name).to.equal(testBandMember.name);
        expect(resMember.instruments).to.deep.equal(testBandMember.instruments);
        done();
      })
    })
  });
  describe('POST /api/bandMember', function() {
    describe('With a valid request body and valid credentials', function() {
      after(done => {
        BandMember.remove({})
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a bandMember object and 200 status code', done => {
        superagent.post(`${url}/api/bandMember`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send(testBandMember)
        .end((err, res) => {
          if(err) return done(err);
          expect(Array.isArray(res.body)).to.equal(true);
          let resMember = req.body[0];
          done();
        })
      })

    });
    describe('With valid credentials and an invalid request body', function() {

    });
    describe('With invalid credentials and and invalid body', function() {

    })
  })
});
