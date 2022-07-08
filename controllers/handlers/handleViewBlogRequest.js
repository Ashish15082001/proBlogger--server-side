const { viewBlog } = require("../viewBlog");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleViewBlogRequest(request, response, next) {
  try {
    const { userId, blogId, date } = request.body;
    const payload = await viewBlog(userId, blogId, date);

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleViewBlogRequest };
