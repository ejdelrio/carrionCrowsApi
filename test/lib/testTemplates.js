'use strict';

const templates = module.exports = {};
const PORT = process.env.PORT || 5000;

templates.url = `http://localhost:${PORT}`;

templates.testUser = {
  userName: 'testUser',
  passWord: 'testPassword',
  email: 'testEmail'
}