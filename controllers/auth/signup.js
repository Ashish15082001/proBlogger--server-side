const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../database/mogoDb");

// - check is email/user already exists in the database
// - if no user with that email exists then store new user data in the database
//  check if data was successfully stored in database
// - send jwt token with payload

const signup = async function (request, response, next) {
  try {
    const { firstName, lastName, email, password, confirmedPassword } =
      request.body;

    const profileImage = request.files[0];

    if (!profileImage) throw new Error("Please select valid image format.");

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
      profileImage,
      aboutUser: { followers: {}, followings: {} },
      aboutBlogs: {
        totalViews: {},
        totalComments: {},
        totalLikes: {},
        trendings: {},
        publishes: {},
        favourites: {},
      },
    });

    if (mongoResponse.acknowledged === false)
      throw new Error("user data insertion failed.");

    const userAccountPayload = {
      firstName,
      lastName,
      email,
      profileImage,
      _id: mongoResponse.insertedId,
      aboutUser: { followers: {}, followings: {} },
      aboutBlogs: {
        totalViews: {},
        totalComments: {},
        totalLikes: {},
        trendings: {},
        publishes: {},
        favourites: {},
      },
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
      user: userAccountPayload,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { signup };
