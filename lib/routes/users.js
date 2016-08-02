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
      log.debug('got %s users for query: ', data.count, req.query);
      res.json(data);
    })
    .catch(next);
});

router.get('/:id', function getUser (req, res, next) {
  log.debug('getting user with id', req.params.id);

  db({
    act: 'read',
    type: 'users',
    guid: req.params.id
  })
    .then(function (data) {
      if (!data) {
        res.status(404).json({
          msg: 'not found'
        });
      } else {
        res.json(data);
      }
    })
    .catch(next);
});

router.post('/', function createUser (req, res, next) {
  log.info('creating user with data', req.body);
  db({
    act: 'create',
    type: 'users',
    fields: req.body
  })
    .then(function (data) {
      log.info('created a user with data', req.body);
      res.json(data);
    })
    .catch(next);
});

router.put('/:id', function updateUser (req, res, next) {
  log.info('update user %s with data', req.params.id, req.body);
  db({
    act: 'update',
    type: 'users',
    fields: req.body,
    guid: req.params.id
  })
    .then(function (data) {
      log.info('created a user with data', req.body);
      res.json(data);
    })
    .catch(next);
});

router.delete('/:id', function updateUser (req, res, next) {
  log.info('delete user %s', req.params.id);

  db({
    act: 'delete',
    type: 'users',
    guid: req.params.id
  })
    .then(function (data) {
      res.json(data);
    })
    .catch(next);
});
