const { login } = require("../auth/login");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleLoginRequest(request, response, next) {
  try {
    const { email, password } = request.body;
    const payload = await login(email, password);

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleLoginRequest };
