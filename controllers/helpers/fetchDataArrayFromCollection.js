const { getDatabase } = require("../../database/mogoDb");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} filter - used for fetching required data
 * @returns {Promise} represents data matched with given filter
 */
async function fetchDataArrayFromCollection(
  collectionName,
  filter,
  skipNumber,
  limitNumber
) {
  const collectionReference = getDatabase().collection(collectionName);
  return await collectionReference
    .find(filter)
    .skip(skipNumber)
    .limit(limitNumber)
    .toArray();
}

module.exports = { fetchDataArrayFromCollection };
