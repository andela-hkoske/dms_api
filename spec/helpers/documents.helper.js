var request = require('superagent');
var Token = require('./token.helper.js');
var users, roles, types;

module.exports = {
  createDocument: function(title, content, done) {
    var create = function(token) {
      request
        .post('http://localhost:3000/api/documents')
        .send({
          title: title,
          content: content,
          owner: users[2]._id,
          roles: roles[0]._id + ' ' + roles[1]._id + ' ' + roles[2]._id,
          type: types[0]._id
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Document has been saved!');
          done();
        });
    };

    var getUsers = function(token) {
      request
        .get('http://localhost:3000/api/users')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            users = res.body;
            create(token);
          }
        });
    };

    var getTypes = function(token) {
      request
        .get('http://localhost:3000/api/types')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            types = res.body;
            getUsers(token);
          }
        });
    };

    var getRoles = function(token) {
      request
        .get('http://localhost:3000/api/roles')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            roles = res.body;
            getTypes(token);
          }
        });
    };

    Token.readToken(done, getRoles);
  },

  restrictViewerDocPost: function(title, content, done) {
    var create = function(token) {
      request
        .post('http://localhost:3000/api/documents')
        .send({
          title: title,
          content: content,
          owner: users[2]._id,
          roles: roles[0]._id + ' ' + roles[1]._id + ' ' + roles[2]._id,
          type: types[0]._id
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(403);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Forbidden. You are not allowed' +
            ' to carry out this action. You need to be a User or' +
            ' Administrator.');
          done();
        });
    };

    var getUsers = function(token) {
      request
        .get('http://localhost:3000/api/users')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            users = res.body;
            create(token);
          }
        });
    };

    var getTypes = function(token) {
      request
        .get('http://localhost:3000/api/types')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            types = res.body;
            getUsers(token);
          }
        });
    };

    var getRoles = function(token) {
      request
        .get('http://localhost:3000/api/roles')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            roles = res.body;
            getTypes(token);
          }
        });
    };

    Token.readViewerToken(done, getRoles);
  },

  createUntitledDocument: function(title, content, done) {
    var create = function(token) {
      request
        .post('http://localhost:3000/api/documents')
        .send({
          title: title,
          content: content,
          owner: users[2]._id,
          roles: roles[0]._id + ' ' + roles[1]._id + ' ' + roles[2]._id,
          type: types[0]._id
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(500);
          expect(res.body.success).toBe(false);
          expect(err).toBeDefined();
          done();
        });
    };

    var getUsers = function(token) {
      request
        .get('http://localhost:3000/api/users')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            users = res.body;
            create(token);
          }
        });
    };

    var getTypes = function(token) {
      request
        .get('http://localhost:3000/api/types')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            types = res.body;
            getUsers(token);
          }
        });
    };

    var getRoles = function(token) {
      request
        .get('http://localhost:3000/api/roles')
        .set('x-access-token', token)
        .end(function(err, res) {
          if (err) {
            done();
          } else {
            roles = res.body;
            getTypes(token);
          }
        });
    };

    Token.readToken(done, getRoles);
  },

  getAllDocuments: function(done) {
    var cb = function(token) {
      request
        .get('http://localhost:3000/api/documents')
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toBeDefined();
          expect(Date.parse(res.body[1].created_at))
            .toBeGreaterThan(Date.parse(res.body[0].created_at));
          done();
        });
    };

    Token.readToken(done, cb);
  },

  getSpecificDocument: function(title, done) {
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
        .send({
          title: title
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0].created_at).toBeDefined();
          expect(res.body[0].updated_at).toBeDefined();
          expect(res.body[0].title).toBeDefined();
          expect(res.body[0].content).toBeDefined();
          expect(res.body[0].owner).toBeDefined();
          expect(res.body[0].type).toBeDefined();
          expect(res.body[0].roles).toBeDefined();
          expect(typeof res.body[0].roles).toBe('object');
          expect(res.body[0].roles instanceof Array).toBe(true);
          expect(res.body[0].roles[0]).toBeDefined();
          expect(res.body[0].roles[0]._id).toBeDefined();
          expect(res.body[0].roles[0].title).toBeDefined();
          expect(res.body[0]).toBeDefined();
          done();
        });
    };

    Token.readToken(done, cb);
  },

  restrictRolesAccess: function(title, done) {
    var getDoc = function(token, id) {
      request
        .get('http://localhost:3000/api/documents/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(403);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Forbidden. You are' +
            ' not allowed to carry out this action. Your' +
            ' role is not provided for in the access of this document.');
          done();
        });
    };
    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
        .send({
          title: title
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          if (!err) {
            getDoc(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readUserToken(done, cb);
  },

  getDocumentsByLimit: function(limit, done) {
    var cb = function(token) {
      request
        .get('http://localhost:3000/api/documents/limit/' + limit)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body.length).toBeLessThan(limit + 1);
          expect(res.body[0]).toBeDefined();
          done();
        });
    };

    Token.readToken(done, cb);
  },

  getDocumentsByType: function(type, done) {
    var cb = function(token, id) {
      request
        .get('http://localhost:3000/api/documents/type/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body[0]).toBeDefined();
          expect(res.body[0].type.title).toBe('Business');
          done();
        });
    };

    var getType = function(token) {
      request
        .post('http://localhost:3000/api/types/find')
        .send({
          title: type
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          if (!err) {
            cb(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readToken(done, getType);
  },

  createDocWithoutAuth: function(title, content, done) {
    request
      .post('http://localhost:3000/api/documents')
      .send({
        title: title,
        content: content,
        owner: users[2]._id,
        roles: roles[0]._id + ' ' + roles[1]._id + ' ' + roles[2]._id,
        type: types[0]._id
      })
      .end(function(err, res) {
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe('Failed to authenticate user' +
          '. No token provided.');
        done();
      });
  },

  updateDocument: function(content, done) {
    var updateOne = function(token, id) {
      request
        .put('http://localhost:3000/api/documents/' + id)
        .set('x-access-token', token)
        .send({
          content: content
        })
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successfully updated your document');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
        .set('x-access-token', token)
        .send({
          title: 'Document 1'
        })
        .end(function(err, res) {
          if (!err && res.body[0]._id) {
            updateOne(token, res.body[0]._id);
          } else {
            done();
          }

        });
    };

    Token.readToken(done, cb);
  },

  deleteDocument: function(title, done) {
    var deleteOne = function(token, id) {
      request
        .del('http://localhost:3000/api/documents/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(res.body.success).toBe(true);
          expect(res.body.message).toBe('Successful deletion of document!');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
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

    Token.readToken(done, cb);
  },

  restrictDelete: function(title, done) {
    var deleteOne = function(token, id) {
      request
        .del('http://localhost:3000/api/documents/' + id)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(403);
          expect(res.body.success).toBe(false);
          expect(res.body.message).toBe('Forbidden. You are not allowed ' +
            'to carry out this' +
            ' action. You need to be an Administrator.');
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
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

    Token.readUserToken(done, cb);
  },

  getDocumentsByRole: function(role, limit, done) {
    var cb = function(token, id) {
      request
        .get('http://localhost:3000/api/documents/role/' + id + '/' + limit)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Array).toBe(true);
          expect(res.body[0]).toBeDefined();
          expect(res.body.length).toBeLessThan(limit + 1);
          expect(res.body[0].roles).toBeDefined();
          expect(res.body[0].roles.length).toBeGreaterThan(0);
          expect(res.body[0].roles instanceof Array).toBe(true);
          expect(res.body[0].roles[0]._id).toBeDefined();
          expect(res.body[0].roles[0].title).toBeDefined();
          done();
        });
    };

    var getRole = function(token) {
      request
        .post('http://localhost:3000/api/roles/find')
        .send({
          title: role
        })
        .set('x-access-token', token)
        .end(function(err, res) {
          if (!err) {
            cb(token, res.body[0]._id);
          } else {
            done();
          }
        });
    };

    Token.readToken(done, getRole);
  },

  getDocumentsByDate: function(title, limit, done) {
    var getDate = function(token, date) {
      request
        .get('http://localhost:3000/api/documents/date/' + date + '/' + limit)
        .set('x-access-token', token)
        .end(function(err, res) {
          expect(res.status).toBe(200);
          expect(typeof(res.body)).toBe('object');
          expect(res.body instanceof Array).toBe(true);
          expect(res.body[0]).toBeDefined();
          expect(res.body.length).toBeLessThan(limit + 1);
          done();
        });
    };

    var cb = function(token) {
      request
        .post('http://localhost:3000/api/documents/find')
        .set('x-access-token', token)
        .send({
          title: title
        })
        .end(function(err, res) {
          if (!err) {
            getDate(token, res.body[0].created_at);
          } else {
            done();
          }
        });
    };

    Token.readToken(done, cb);
  }
};
