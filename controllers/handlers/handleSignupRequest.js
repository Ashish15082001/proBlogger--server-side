const { signup } = require("../auth/signup");

/**
 *
 * @param {Object} request
 * @param {Object} response
 * @param {Callback} next
 * @returns {Promise}
 */
async function handleSignupRequest(request, response, next) {
  try {
    const { firstName, lastName, email, password, confirmedPassword } =
      request.body;
    const profileImage = request.files[0];
    const payload = await signup(
      firstName,
      lastName,
      email,
      password,
      confirmedPassword,
      profileImage
    );

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
}

module.exports = { handleSignupRequest };
