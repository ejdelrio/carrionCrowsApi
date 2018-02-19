'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const BandMember = require('../model/bandMember.js');
const {url, testUser, testBandMember} = require('./lib/testTemplates');
const helper = require('./lib/helper');
const {createUser, clearDB} = helper;

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
      done();
    })

    after(done => {
      done();
    })

    it('Should return an array of band member models', done => {
      superagent.get(`${url}/api/bandMember`)
      .end((err, res) => {
        if(err) return done(err);
        let reqMember = req.body;
        expect(Array.isArray(req.body)).to.equal(true);
        expect(reqMember.name).to.equal(testBandMember.name);
        expect(reqMember.instruments).to.deep.equal(testBandMember.instruments);
        done();
      })
    })
  });
});
