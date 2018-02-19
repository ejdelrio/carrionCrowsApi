'use strict';

require('debug')('ccApp: Band Member Model');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const bandMemberSchema = new Schema({
  name: {type: 'string', required: true},
  bio: {type: 'string', required: false, default: ''},
  photoUrl: {type: 'string', required: false, default: ''},
  instruments: [{type: Schema.Types.ObjectId, required: false}]
});

module.exports = mongoose.model('bandMember', bandMemberSchema);
