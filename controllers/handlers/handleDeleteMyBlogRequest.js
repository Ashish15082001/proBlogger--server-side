const { deleteMyBlog } = require("../deleteMyBlog");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleDeleteMyBlogRequest(request, response, next) {
  try {
    const { userId, blogId } = request.params;
    const payload = await deleteMyBlog({ userId, blogId });

    response.json({ message: "Blog deleted Successfully.", payload });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleDeleteMyBlogRequest };
