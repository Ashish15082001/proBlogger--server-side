const { addBlogToFavourites } = require("../addBlogToFavourites");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleAddBlogToFavourites(request, response, next) {
  try {
    const { userId, blogId } = request.params;
    const { date } = request.body;
    const payload = await addBlogToFavourites({ userId, blogId, date });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleAddBlogToFavourites };
