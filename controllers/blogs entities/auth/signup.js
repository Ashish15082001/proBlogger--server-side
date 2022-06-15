const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../../database/mogoDb");

// - check is email/user already exists in the database
// - if no user with that email exists then store new user data in the database
//  check if data was successfully stored in database
// - send jwt token with payload

const signup = async function (request, response, next) {
  try {
    const { firstName, lastName, email, password, confirmedPassword } =
      request.body.user;

    const usersCollection = getDatabase().collection("users");
    const doesUserAlreadyExists = await usersCollection.findOne({ email });

    if (doesUserAlreadyExists) {
      throw new Error("user already exists.");
    }

    const mongoResponse = await usersCollection.insertOne({
      firstName,
      lastName,
      email,
      password,
      blogs: { myBlogs: {}, trendingBlogs: {}, favouriteBlogs: {} },
    });

    if (mongoResponse.acknowledged === false)
      throw new Error("user data insertion failed.");

    const userAccountPayload = {
      firstName,
      lastName,
      email,
      _id: mongoResponse.insertedId,
    };

    const token = jwt.sign(
      {
        userId: mongoResponse.insertedId.toString(),
      },
      "ashishsinghsecret",
      { expiresIn: "1h" }
    );

    response.json({
      token,
      payload: userAccountPayload,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { signup };
