'use strict';

require('debug')('ccApp: Album Model');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const albumSchema = new Schema({
  name: {type: 'string', required: true},
  tracks: [{type: Schema.Types.ObjectId, ref: 'track'}],
  description: {type: 'string', required: false},
  genre: {type: 'string', required: false, default: ''}
});

module.exports = mongoose.model('album', albumSchema);