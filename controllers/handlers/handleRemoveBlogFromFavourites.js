const { removeBlogFromFavourites } = require("../removeBlogFromFavourites");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleRemoveBlogFromFavourites(request, response, next) {
  try {
    const { userId, blogId } = request.params;
    const payload = await removeBlogFromFavourites({ userId, blogId });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleRemoveBlogFromFavourites };
