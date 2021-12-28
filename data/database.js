const mongodb = require('mongodb');

const mongodbUrl = require('../config/mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connect() {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db('basic-blog-app-nodejs-express-ejs');
}

function getDb() {
  if (!database) {
    throw new Error('Database not connected');
  }

  return database;
}

module.exports = {
  connect,
  getDb,
};
