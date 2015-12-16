var request = require('superagent');
var Token = require('./token.helper.js');

module.exports = {
  createUser: function(last, first, email, username, password, done) {
    request
      .post('http://localhost:3000/api/users')
      .send({
        firstname: first,
        lastname: last,
        email: email,
        username: username,
        password: password
      })
      .end(function(err, res) {
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe('User has been created!');
        done();
      });
  },

  createEmptyUser: function(last, first, email, username, password, done) {
    request
      .post('http://localhost:3000/api/users')
      .send({
        firstname: first,
        lastname: last,
        email: email,
        username: username,
        password: password
      })
      .end(function(err, res) {
        expect(res.status).toBe(500);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('User validation failed');
        done();
      });
  },

  login: function(username, password, done) {
    request
      .post('http://localhost:3000/api/users/login')
      .send({
        username: username,
        password: password
      })
      .end(function(err, res) {
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Successfully logged in');
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        done();
      });
  },

  getAllUsers: function(done) {
    var cb = function(token) {
      request
        .get('http://localhost:3000/api/users')
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

  verifyRolePresent: function(done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: 'john.doe'
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].role).toBeDefined();
          expect(res.body[0].role.title).toBe('Viewer');
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  verifyNamesPresent: function(done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: 'john.doe'
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].name).toBeDefined();
          expect(res.body[0].name.first).toBeDefined();
          expect(res.body[0].name.last).toBeDefined();
          expect(res.body[0].name.first).toBe('John');
          done();
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  updateUser: function(username, last, first, done) {
    var update = function(token, id) {
      request
        .put('http://localhost:3000/api/users/' + id)
        .set('x-access-token', token)
        .send({
          firstname: first,
          lastname: last
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully updated your profile');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: username
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

  deleteUser: function(username, done) {
    var deleteOne = function(token, id) {
      request
        .del('http://localhost:3000/api/users/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully deleted ' +
            'user and their documents.');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: username
        })
        .end(function(err, res) {
          if (!err) {
            deleteOne(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    request
      .post('http://localhost:3000/api/users')
      .send({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe1@unknown.com',
        username: 'john.doe1',
        password: 'john.doe1'
      })
      .end(function(err, res) {
        if (!err && res) {
          Token.readAuthToken('admin', done, cb);
        } else {
          done();
        }
      });
  },

  getUserDocuments: function(username, done) {
    var documents = function(token, id) {
      request
        .get('http://localhost:3000/api/users/' + id + '/documents')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Array).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toBeDefined();
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: username
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            documents(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, cb);
  },

  getSpecificUser: function(username, done) {
    var getUser = function(token, id) {
      request
        .get('http://localhost:3000/api/users/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Object).toBe(true);
          expect(res.body.name).toBeDefined();
          expect(res.body.username).toBeDefined();
          expect(res.body.password).toBeDefined();
          expect(res.body.email).toBeDefined();
          expect(res.body.role).toBeDefined();
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/users/find')
        .set('x-access-token', token)
        .send({
          username: username
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            getUser(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readAuthToken('admin', done, cb);
  }
};
