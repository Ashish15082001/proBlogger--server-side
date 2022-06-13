const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../../database/mogoDb");

const signup = async function (request, response, next) {
  try {
    const { firstName, lastName, email, password, confirmedPassword } =
      request.body.user;

    const usersCollection = getDatabase().collection("users");
    const doesUserAlreadyExists = await usersCollection.findOne({ email });

    if (doesUserAlreadyExists) {
      throw new Error("user already exists.");
    }

    console.log(doesUserAlreadyExists);
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
      isError: false,
      token,
      payload: userAccountPayload,
    });
  } catch (error) {
    response.json({ isError: true, description: error.message });
  }
};

module.exports = { signup };
