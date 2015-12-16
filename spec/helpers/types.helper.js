var request = require('superagent');
var Token = require('./token.helper.js');

module.exports = {
  createType: function(title, done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/types')
        .send({
          title: title
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully created a new type');
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  createUntitledType: function(title, done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/types')
        .send({
          title: title
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(500);
          expect(res.body.success).toBe(false);
          expect(err).toBeDefined();
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  getAllTypes: function(done) {
    var cb = function(token) {
      request
        .get('http://localhost:3000/api/types')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toBeDefined();
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  createWithoutAuth: function(title, done) {
    request
      .post('http://localhost:3000/api/types')
      .send({
        title: title
      })
      .end(function(err, res) {
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Failed to authenticate user' +
          '. No token provided.');
        done();
      });
  },

  getSpecificType: function(title, done) {
    var getType = function(token, id) {
      request
        .get('http://localhost:3000/api/types/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Object).toBe(true);
          expect(res.body.title).toBeDefined();
          expect(res.body.title).toBe('Memo');
          expect(res.body._id).toBeDefined();
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/types/find')
        .set('x-access-token', token)
        .send({
          title: title
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            getType(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  updateType: function(oldTitle, newTitle, done) {
    var update = function(token, id) {
      request
        .put('http://localhost:3000/api/types/' + id)
        .set('x-access-token', token)
        .send({
          title: newTitle
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully updated a type');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/types/find')
        .set('x-access-token', token)
        .send({
          title: oldTitle
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            update(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  deleteType: function(title, done) {
    var deleteOne = function(token, id) {
      request
        .del('http://localhost:3000/api/types/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully deleted type.');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/types/find')
        .set('x-access-token', token)
        .send({
          title: title
        })
        .end(function(err, res) {
          if (!err) {
            deleteOne(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    var create = function(token) {
      request
        .post('http://localhost:3000/api/types')
        .set('x-access-token', token)
        .send({
          title: 'Budgets'
        })
        .end(function(err, res) {
          if (!err && res) {
            cb(token);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, create);
  }
};
