const { publishComment } = require("../publishComment");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handlePublishComment(request, response, next) {
  try {
    const { userId, blogId, comment, date } = request.body;
    const payload = await publishComment({ userId, blogId, comment, date });

    response.json(payload);
  } catch (error) {
    response.status(400).json({
      message: error.message,
    });
  }
}

module.exports = { handlePublishComment };
