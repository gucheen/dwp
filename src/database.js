const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const config = require('../config');

const dbUrl = config.dbUrl;
const dbName = config.dbName;
const client = new MongoClient(dbUrl, { useNewUrlParser: true });

const update = ({ collection, updater, options }) => {
  const db = client.db(dbName);
  const colc = db.collection(collection);
  return colc.update({ id: updater.id }, { $set: updater }, options);
}

const updateOne = ({ collection, updater, options }, callback) => {
  const db = client.db(dbName);
  const colc = db.collection(collection);
  return colc.updateOne({ id: updater.id }, { $set: updater }, options, (err, result) => {
    callback(err, result);
  });
}

const bulk = ({ collection, operations }, callback) => {
  const db = client.db(dbName);
  const colc = db.collection(collection);
  const bulk = colc.initializeUnorderedBulkOp();
  operations.forEach((operation) => {
    const { id } = operation;
    bulk.find({ id }).upsert().updateOne({ $setOnInsert: operation });
  });
  bulk.execute((err, { result }) => {
    if (err) {
      callback(err);
      return;
    }
    assert.equal(result.ok, 1);
    assert.equal(result.writeErrors.length, 0);
    assert.equal(result.nUpserted || result.nMatched, operations.length);
    callback(null, result);
  });
};

const query = ({ collection, query }, callback) => {
  const db = client.db(dbName);
  const colc = db.collection(collection);
  colc.find(query).toArray((err, docs) => {
    callback(err, docs);
  });
};

module.exports = {
  query,
  bulk,
  client,
  update,
  updateOne,
  dbName,
};
