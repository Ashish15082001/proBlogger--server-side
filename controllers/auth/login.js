const jwt = require("jsonwebtoken");
const { Db } = require("mongodb");

const { getDatabase } = require("../../database/mogoDb");

// - check if email/user exists in data base
// - if email/user exists then check if password stored in the database matches with the password entered by user
// - when no error, send jwt token with payload

const login = async function (request, response, next) {
  try {
    const { email, password } = request.body;

    const usersCollection = getDatabase().collection("users");
    const userData = await usersCollection.findOne({
      "credentials.email": email,
    });

    if (!userData) throw new Error("user does not exists.");

    const userCredentials = userData.credentials;
    if (userCredentials.password !== password)
      throw new Error("Invalid password.");

    const token = jwt.sign(
      {
        userId: userData._id.toString(),
      },
      "ashishsinghsecret",
      { expiresIn: "1h" }
    );

    const statistics = {
      aboutUser: userData.statistics.aboutUser,
      aboutBlogs: {
        ...userData.statistics.aboutBlogs,
      },
    };

    response.json({
      token,
      credentials: {
        ...userCredentials,
        _id: userData._id,
        password: undefined,
      },
      statistics,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { login };
