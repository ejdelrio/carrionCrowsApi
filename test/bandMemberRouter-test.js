'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const BandMember = require('../model/bandMember.js');
const {url, testUser, testBandMember} = require('./lib/testTemplates');

require('../server.js');
