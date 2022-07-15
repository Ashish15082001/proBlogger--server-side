const { getDatabase } = require("../../database/mogoDb");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} data - data to be inserted into given collection
 * @returns {Promise} represents insertion response
 */
async function deleteDataFromCollection({ collectionName, filter }) {
  const collectionReference = getDatabase().collection(collectionName);
  return await collectionReference.deleteOne(filter);
}

module.exports = { deleteDataFromCollection };
