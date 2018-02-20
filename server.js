'use strict';

require('dotenv').config();
const express = require('express');
const debug = require('debug')('ccApp: server.js');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const app = express();
mongoose.connect(process.env.MONGODB_URI);

const userRouter = require('./route/userRouter');
const bandMemberRouter = require('./route/bandMemberRouter')
const albumRouter = require('./route/albumRouter');
const trackRouter = require('./route/trackRouter.js');

app.use(morgan('dev'));
app.use(cors());
app.use(userRouter);
app.use(bandMemberRouter);
app.use(albumRouter);
app.use(trackRouter);
app.use(require('./lib/error'));

app.listen(PORT, () => {
	debug('Server active on port: ', PORT);
});
