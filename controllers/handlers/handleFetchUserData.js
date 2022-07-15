const { fetchUserData } = require("../fetchUserData");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleFetchUserData(request, response, next) {
  try {
    const { userId } = request.params;
    const payload = await fetchUserData({ userId });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleFetchUserData };
