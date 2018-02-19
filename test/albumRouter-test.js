'use strict';

const expect = require('chai').expect;
const superagent = require('superagent');

const {url, testUser, testAlbum} = require('./lib/testTemplates');
const helper = require('./lib/helper');

require('../server.js');