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
          let {name, bio, instruments} = res.body;
          expect(res.status).to.equal(200);
          expect(name).to.equal(testBandMember.name);
          expect(bio).to.equal(testBandMember.bio);
          expect(instruments).to.deep.equal(testBandMember.instruments);
          done();
        })
      })

    });
    describe('With valid credentials and an invalid request body', function() {
      after(done => {
        BandMember.remove({})
        .then(() => done())
        .catch(err => done(err));
      })

      it('Should return a 400 error code', done => {
        superagent.post(`${url}/api/bandMember`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .send({})
        .end(err => {
          expect(err.status).to.equal(400);
          done();
        });
      });
    });
    describe('With invalid credentials and and invalid body', function() {
      it('Should return a 401 error code', done => {
        superagent.post(`${url}/api/bandMember`)
        .set('Authorization', 'Bearer invalid')
        .send({})
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        });
      });
    });
    describe('PUT /api/bandMember/:_id', function() {

      before(done => {
        createModel('testBandMember', BandMember, testBandMember)
        .then(() => done())
        .catch(err => done(err));
      });

      after(done => {
        BandMember.remove({})
        .then(() => done())
        .catch(err => done(err));
      });

      describe('With valid credentials and valid request body', function() {

        it('Should return a 200 status code and updated Band Member', done => {
          let reqModel = helper.models.testBandMember;
          superagent.put(`${url}/api/bandMember/${reqModel._id}`)
          .send({name: 'Dildo Baggins'})
          .set('Authorization', `Bearer ${helper.tokens.testUser}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body._id).to.equal(reqModel._id.toString());
            expect(res.body.name).to.not.equal(reqModel.name);
            expect(res.body.instruments).to.deep.equal(reqModel.instruments);
            done();
          });
        });
      });

      describe('With valid credentials and an invalid request id', function() {

        it('Should return a 400 error code', done => {
          let reqModel = helper.models.testBandMember;
          superagent.put(`${url}/api/bandMember/${1234}`)
          .send({name: 'bob'})
          .set('Authorization', `Bearer ${helper.tokens.testUser}`)
          .end(err => {
            expect(err.status).to.equal(404);
            done();
          });
        });

        describe('With invalid credentials and an invalid request body', function() {

          it('Should return a 401 error code', done => {
            let reqModel = helper.models.testBandMember;
            superagent.put(`${url}/api/bandMember/${reqModel._id}`)
            .send({NAME: 'Dildo Baggins'})
            .set('Authorization', 'Bearer invaid')
            .end(err => {
              expect(err.status).to.equal(401);
              done();
            });
          });
        });
      });
    });
  });
  describe('DELETE /api/bandMember/:id', function() {

    describe('With valid credentials and request id', function() {

      before(done => {
        createModel('testBandMember', BandMember, testBandMember)
        .then(() => done())
        .catch(err => done(err));
      });

      it('Should return a 204 status code', done => {
        let reqModel = helper.models.testBandMember;
        superagent.delete(`${url}/api/bandMember/${reqModel._id}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
    describe('With valid credentials and an invalid request id', function() {

      before(done => {
        createModel('testBandMember', BandMember, testBandMember)
        .then(() => done())
        .catch(err => done(err));
      });

      it('Should return a 404 error code', done => {
        superagent.delete(`${url}/api/bandMember/${1234}`)
        .set('Authorization', `Bearer ${helper.tokens.testUser}`)
        .end(err => {
          expect(err.status).to.equal(404);
          done();
        });
      });
    });
    describe('With invalid credentials and an invalid request id', function() {

      before(done => {
        createModel('testBandMember', BandMember, testBandMember)
        .then(() => done())
        .catch(err => done(err));
      });

      it('Should return a 401 error code', done => {
        superagent.delete(`${url}/api/bandMember/${1234}`)
        .set('Authorization', 'Bearer invalid')
        .end(err => {
          expect(err.status).to.equal(401);
          done();
        })
      })
    })
  });
});
