const mongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.MONGODB;
const client = new mongoClient(uri);

let instance = null;

async function getConnection() {
  if (instance == null) {
    instance = await client.connect();
  }
  return instance;
}

module.exports = { getConnection };
