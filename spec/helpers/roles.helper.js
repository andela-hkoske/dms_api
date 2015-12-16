var request = require('superagent');
var Token = require('./token.helper.js');

module.exports = {
  createRole: function(title, done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/roles')
        .send({
          title: title
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully created a new role');
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  createUntitledRole: function(title, done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/roles')
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

  getAllRoles: function(done) {
    var cb = function(token) {
      request
        .get('http://localhost:3000/api/roles')
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
      .post('http://localhost:3000/api/roles')
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

  getSpecificRole: function(title, done) {
    var getRole = function(token, id) {
      request
        .get('http://localhost:3000/api/roles/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Object).toBe(true);
          expect(res.body.title).toBeDefined();
          expect(res.body.title).toBe('Standard');
          expect(res.body._id).toBeDefined();
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/roles/find')
        .set('x-access-token', token)
        .send({
          title: title
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            getRole(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  updateRole: function(oldTitle, newTitle, done) {
    var update = function(token, id) {
      request
        .put('http://localhost:3000/api/roles/' + id)
        .set('x-access-token', token)
        .send({
          title: newTitle
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully updated a role');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/roles/find')
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

  deleteRole: function(title, done) {
    var deleteOne = function(token, id) {
      request
        .del('http://localhost:3000/api/roles/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully deleted role.');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/roles/find')
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
        .post('http://localhost:3000/api/roles')
        .set('x-access-token', token)
        .send({
          title: 'AllAccess'
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
