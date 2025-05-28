const http = require('http');

describe('Health Check', function () {
  this.timeout(5000); // Aumenta a 5 segundos (opcional)

  it('should return 200 OK from /health endpoint', (done) => {
    http.get('http://localhost:3000/health', (res) => {
      if (res.statusCode === 200) {
        done();
      } else {
        done(new Error(`Expected status 200, got ${res.statusCode}`));
      }
    }).on('error', (err) => {
      done(err);
    });
  });
});
