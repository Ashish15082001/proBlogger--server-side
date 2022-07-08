const { getDatabase } = require("../../database/mogoDb");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} filter - used for updating required data
 * @param {Object} dataWithQuery - data to be inserted into given collection
 * @returns {Promise} represents updation response
 */
async function updateDataInCollection(collectionName, filter, dataWithQuery) {
  const collectionReference = getDatabase().collection(collectionName);
  return await collectionReference.updateOne(filter, dataWithQuery);
}

module.exports = { updateDataInCollection };
