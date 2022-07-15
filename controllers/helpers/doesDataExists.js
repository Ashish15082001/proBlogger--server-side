const { fetchDataFromCollection } = require("./fetchDataFromCollection");

/**
 *
 * @param {string} collectionName - name of collection
 * @param {Object} filter - for fetching required data from collection
 * @returns {Boolean} true if data exists else false
 */
async function doesDataExists({ collectionName, filter }) {
  const user = await fetchDataFromCollection(collectionName, filter);
  return user ? true : false;
}

module.exports = { doesDataExists };
