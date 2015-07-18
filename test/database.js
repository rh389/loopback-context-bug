var MongoClient = require('mongodb').MongoClient
  , EJSON  = require('mongodb-extended-json')
  , app = require('../server/server.js')
  , connection
  , adapter = app.datasources.db.adapter;

/**
 * Connect to the database
 * @returns {*|exports|module.exports}
 */
exports.connect = function connect() {
  return new Promise(function(resolve, reject){
    if (connection) return resolve(connection);
    MongoClient.connect(adapter.settings.url, function(err, conn) {
      if (err) {
        reject(err);
      } else {
        connection = conn;
        resolve();
      }
    });
  });
};

/**
 * Tear down all collections
 * @returns {*|exports|module.exports}
 */
exports.tearDown = function tearDown() {
  return new Promise(function(resolve, reject) {
    if (!connection) return reject(Error('DB not connected'));
    var collectionsPromises = [];
    connection.collections(function (err, collections) {
      if (err) return reject();
      collections.forEach(function (collection) {
        if (collection.collectionName != 'system.indexes') {
          collectionsPromises.push(dropCollection(collection));
        }
      });
      Promise.all(collectionsPromises).then(function(){resolve();});
    });
  });
};

/**
 * Drop a collection
 * @param collection
 * @returns {*|exports|module.exports}
 */
function dropCollection(collection) {
  return new Promise(function(resolve, reject){
    if (!connection) return reject(Error('DB not connected'));
    connection.dropCollection(collection.collectionName, function(err){
      if (err){
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Adds data fixtures
 * @param name
 * @returns {*|exports|module.exports}
 */
exports.fixture = function fixture(name) {
  return new Promise(function(resolve, reject){

    var data = EJSON.parse(JSON.stringify(require('./fixtures/' + name)));

    var names = Object.keys(data.collections);
    var collectionsPromises = [];
    names.forEach(function(name){
      collectionsPromises.push(insertData(name, data.collections[name]));
    });
    Promise.all(collectionsPromises).then(function(){resolve();});
  });
};

/**
 * Inserts data into the database
 * @param collectionName
 * @param data
 * @returns {*|exports|module.exports}
 */
function insertData(collectionName, data) {
  return new Promise(function(resolve, reject) {
    if (!connection) return reject(Error('DB not connected'));

    connection.createCollection(collectionName, function(err, collection) {
      collection.insert(data, null, function(err){
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}
