'use strict';

const expect = require('chai').expect;
const User = require('../model/user.js');
const superagent = require('superagent');

describe('Example test', function() {
  describe('POST /api/user', function () {
    describe('With a valid request body', function() {
      after(done => {
        User.remove({})
        .then(() => done());
      })
      it('Should return a json web token and 200 code', done => {
        superagent.post('')
        .send({})
        .end((err, res) => {
          if(err) return done(err);
          done()
        })
      })
    })
  })
});