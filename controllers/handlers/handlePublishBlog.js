const { publishBlog } = require("../publishBlog");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handlePublishBlog(request, response, next) {
  try {
    const { userId } = request.params;
    const blogData = request.body;
    const blogProfileImage = request.files[0];
    const payload = await publishBlog({ userId, blogData, blogProfileImage });

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handlePublishBlog };
