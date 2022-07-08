const { getDatabase } = require("../../database/mogoDb");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} data - data to be inserted into given collection
 * @returns {Promise} represents insertion response
 */
async function insertDataIntoCollection(collectionName, data) {
  const collectionReference = getDatabase().collection(collectionName);
  return await collectionReference.insertOne(data);
}

module.exports = { insertDataIntoCollection };
