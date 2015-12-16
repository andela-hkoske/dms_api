var request = require('superagent'),
  token, viewerToken, userToken;

module.exports = {
  readAuthToken: function(role, done, cb) {
    var user = {};
    switch (role) {
      case 'admin':
        user.username = 'JaneDoe97';
        user.password = 'JaneDoe97';
        break;
      case 'user':
        user.username = 'JaneDoe98';
        user.password = 'JaneDoe98';
        break;
      case 'viewer':
        user.username = 'JaneDoe99';
        user.password = 'JaneDoe99';
        break;
    }
    if (token && role === 'admin') {
      cb(token);
    } else if (userToken && role === 'user') {
      cb(userToken);
    } else if (viewerToken && role === 'viewer') {
      cb(viewerToken);
    } else {
      request
        .post('http://localhost:3000/api/users/login')
        .send(user)
        .end(function(err, res) {
          if (res && !err) {
            switch (role) {
              case 'admin':
                token = res.body.token;
                break;
              case 'user':
                userToken = res.body.token;
                break;
              case 'viewer':
                viewerToken = res.body.token;
                break;
            }
            cb(res.body.token);
          } else {
            done();
          }
        });
    }
  }
};
