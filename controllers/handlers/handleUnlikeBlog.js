const { unLikeBlog } = require("../unLikeBlog");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleUnlikeBlog(request, response, next) {
  try {
    const { userId, blogId } = request.body;
    const payload = await unLikeBlog({ userId, blogId });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleUnlikeBlog };
