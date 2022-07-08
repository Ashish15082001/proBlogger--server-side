const { fetchDataFromCollection } = require("./fetchDataFromCollection");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} filter - for fetching required data from collection
 * @returns {Boolean} true if data exists else false
 */
async function doesDataExists(collectionName, filter) {
  return (await fetchDataFromCollection(collectionName, filter)) ? true : false;
}

module.exports = { doesDataExists };
