'use strict';

var expect = require('chai').expect
  , sinon = require('sinon')
  , supertest = require('supertest')
  , proxyquire = require('proxyquire');

require('sinon-as-promised')(require('bluebird'));

describe(__filename, function () {
  var dbStub, request;

  beforeEach(function () {
    dbStub = sinon.stub();

    var app = require('express')();
    var usersRouter = proxyquire('lib/routes/users', {
      'fh-mbaas-api': {
        db: dbStub
      }
    });
    app.use('/users', usersRouter);
    request = supertest(app);
  });

  describe('GET /users', function () {
    it('should return a list of users', function (done) {
      dbStub.yields(null, {
        count: 2,
        list: [{}, {}]
      });

      request.get('/users')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.list).to.have.length(2);
          done();
        });
    });
  });


  describe('GET /users', function () {
    it('should return a list of users based on query', function (done) {
      dbStub.returns({
        count: 2,
        list: [{}, {}]
      });

      request.get('/users?firstname=jane')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.list).to.have.length(2);

          expect(dbStub.getCall(0).args[0].eq).to.deep.equal({
            firstname: 'jane'
          });

          done();
        });
    });
  });
});
