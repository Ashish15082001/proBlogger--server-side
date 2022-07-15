const { fetchBlogs } = require("../fetchBlogs");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleFetchBlogs(request, response, next) {
  try {
    const { pageNumber } = request.query;
    const payload = await fetchBlogs({ pageNumber });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleFetchBlogs };
