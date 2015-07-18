module.exports = function (TestModel) {
  var self = this;

  TestModel.remoteMethod('test', {
    description: 'Test that getCurrentContext() returns null after database operations',
    accepts: [
      {arg: 'pass', type: 'boolean'}
    ],
    http: {verb: 'post', path: '/test'}
  });

  TestModel.test = function (pass, cb) {
    new Promise(function (resolve, reject) {
      TestModel.find({}, function (err) {
        if (err) { return reject(err); }
        resolve();
      });
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        if (pass) {
          //With a dummy asynchronous operation, the context survives
          setTimeout(function () {
            //getCurrentContext() returns a context here
            resolve();
          }, 50);
        } else {
          //With a database operation, it does not.
          TestModel.find({}, function (err) {
            if (err) { return reject(err); }
            //getCurrentContext() returns null here
            resolve();
          });
        }
      });
    })
    .then(function () {
      if (TestModel.app.loopback.getCurrentContext() === null) {
        cb({status: 500, message: 'getCurrentContext() === null'});
      }
      cb(null, 'Context is alive!');
    })
    .catch(cb)
  };
};
