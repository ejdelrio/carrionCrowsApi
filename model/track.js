'use strict';

require('debug')('ccApp: Track Model');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const trackSchema = new Schema({
  name: {type: 'string', required: true},
  albumId: {type: Schema.Types.ObjectId, required: true},
  url: {type: 'string', required: true},
  awsKey: {type: 'string', required: true},
  awsURI: {type: 'string', required: true}
});

module.exports = mongoose.model('track', trackSchema);
