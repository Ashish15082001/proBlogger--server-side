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
    const userData = await usersCollection.findOne({ email });

    if (!userData) throw new Error("email does not exists.");
    if (userData.password !== password) throw new Error("Invalid password.");

    const totalViews = {};
    const totalLikes = {};
    const totalComments = {};
    const trendings = {};

    const token = jwt.sign(
      {
        userId: userData._id.toString(),
      },
      "ashishsinghsecret",
      { expiresIn: "1h" }
    );

    response.json({
      token,
      user: {
        ...userData,
        aboutBlogs: {
          ...userData.aboutBlogs,
          totalViews,
          totalLikes,
          totalComments,
          trendings,
        },
        password: undefined,
        blogs: undefined,
      },
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { login };
