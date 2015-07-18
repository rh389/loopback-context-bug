module.exports = {
  db: {
    host: process.env.MONGODB_PORT_27017_TCP_ADDR || 'localhost',
    port: process.env.MONGODB_PORT_27017_TCP_PORT || 27017,
    database: process.env.MONGODB_DB || 'loopback-context',
    connector: 'mongodb'
  }
};
