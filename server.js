'use strict';

const express = require('express');
const debug = require('debug')('ccApp: server.js');
const PORT = process.env.PORT || 5000;
const app = express();

app.listen(PORT, () => {
	debug('Server active on port: ', PORT);
});
