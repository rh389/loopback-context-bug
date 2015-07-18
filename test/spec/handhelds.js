var supertest = require('supertest')
  , app = require('../../server/server.js')
  , server = supertest.agent(app)
  , db = require('../database.js');

describe('/api/tests', function() {
  beforeEach(function setupDatabase(done){
    db
      .connect()
      .then(db.tearDown)
      .then(done)
      .catch(function(){
        console.log('Could not setup DB');
        process.kill(process.pid);
      });
  });

  it('context is not usually null', function(done) {
    supertest(app)
      .post('/api/tests/test?pass=true')
      .send({})
      .expect(204, done);
  });

  it('context is null after a database operation', function(done) {
    supertest(app)
      .post('/api/tests/test?pass=false')
      .send({})
      .expect(function(res) {
        if (res.body.error.message !== 'getCurrentContext() === null') throw new Error('Expecting currentContext null');
      })
      .expect(500, done);
  });
});
