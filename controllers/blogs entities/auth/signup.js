const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../../database/mogoDb");

const signup = async function (request, response, next) {
  try {
    const { firstName, lastName, email, password, confirmedPassword } =
      request.body.user;
    let responsePayload;

    const blogsCollection = getDatabase().collection("users");
    const mongoResponse = await blogsCollection.insertOne({
      firstName,
      lastName,
      email,
      password,
      blogs: { myBlogs: {}, trendingBlogs: {}, favouriteBlogs: {} },
    });

    if (mongoResponse.acknowledged === false)
      throw new Error("user data insertion failed.");

    responsePayload = {
      firstName,
      lastName,
      email,
      blogs: { myBlogs: {}, trendingBlogs: {}, favouriteBlogs: {} },
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
      payload: responsePayload,
    });
  } catch (err) {
    response.json();
  }
};

module.exports = { signup };
