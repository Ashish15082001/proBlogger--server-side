const { getDatabase } = require("../../database/mogoDb");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} filter - used for fetching required data
 * @returns {Promise} represents data matched with given filter
 */
async function fetchDataFromCollection({ collectionName, filter }) {
  const collectionReference = getDatabase().collection(collectionName);
  return await collectionReference.findOne(filter);
}

module.exports = { fetchDataFromCollection };
