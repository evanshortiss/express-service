'use strict';

var express = require('express');
var Promise = require('bluebird');
var db = Promise.promisify(require('fh-mbaas-api').db);
var log = require('fh-bunyan').getLogger(__filename);

// Our router object
var router = module.exports = express.Router();

router.use(require('body-parser').json());

router.get('/', function listUsers (req, res, next) {
  log.debug('getting users for query', req.query);

  db({
    act: 'list',
    type: 'users',
    eq: req.query
  })
    .then(function (data) {
      log.debug('got %s users', data.count);
      res.json(data);
    })
    .catch(next);
});


router.post('/', function createUser (req, res, next) {
  db({
    act: 'create',
    type: 'users',
    fields: req.body
  })
    .then(function (data) {
      res.json(data);
    })
    .catch(next);
});
