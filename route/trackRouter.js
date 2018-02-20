'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('ccApp: Track Router');

const Track = require('../model/track.js');
const Album = require('../model/album.js');
const bearerAuth = require('../lib/bearer.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const trackRouter = module.exports = Router();
var trackKey = '';

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if(err) reject(err);
      resolve(s3data);
    });
  });
};

trackRouter.post('/api/track/:albumId', bearerAuth, upload.single('soundFile'), function (req, res, next) {
  debug('POST: /api/track/:albumId');

  if (!req.file) return next(createError(400, 'file not found'));
  if (!req.file.path) return next(createError(500, 'file not saved'));
  
  let ext = path.extname(req.file.originalname);
  var trackObject;

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };
  
  s3uploadProm(params)
  .then(s3data => {
    del([`${dataDir}/*`]);
    trackObject = {
      name: req.body.name,
      url: req.body.url,
      albumId: req.params.albumId,
      awsKey: s3data.key,
      awsURI: s3data.Location
    }
    return new Track(trackObject).save();
  })
  .then(track => {
    trackObject = track;
    return Album.findByIdAndUpdate(
      req.params._id,
      {$push: {'tracks': track._id}},
      {new: true}
    );
  })
  .then(() => console.log('__TRACK_CREATED__'))
  .then(() => res.json(trackObject))
  .catch(err => next(createError(400, err.message)));

});

trackRouter.delete(`/api/album/:id/track/:_id`, bearerAuth, function (req, rsp, done) {
  console.log(req.body);
  var params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${trackKey}`
  }

  function s3deleteProm(params) {
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, s3data) => {
        if (err) console.log(err);
        resolve(s3data);
      })
    })
  }

  Album.findById(req.params.id)
    .then(() => {
      return Track.findByIdAndRemove(`${req.params._id}`)
    })
    .then(() => {
      return s3deleteProm(params).then(() => { console.log('deleted ', params.Key)})
    })
    .then(() => {
      rsp.send(204);
      rsp.end();
      done();
    })
    .catch((err) => {
      done(err);
    })
});
