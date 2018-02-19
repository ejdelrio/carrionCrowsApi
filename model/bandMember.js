'use strict';

require('debug')('ccApp: Band Member Model');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const bandMemberSchema = new Schema({
  name: {type: 'string', required: true},
  bio: {type: 'string', required: false, default: ''},
  insturments: [{type: 'string', required: false}],
  photoUrl: {type: 'string', required: false, default: ''}
});

module.exports = mongoose.model('bandMember', bandMemberSchema);
