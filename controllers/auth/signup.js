const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../database/mogoDb");

// - check is email/user already exists in the database
// - if no user with that email exists then store new user data in the database
// - when no error, send jwt token with payload

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
      credentials: {
        firstName,
        lastName,
        email,
        password,
        profileImage,
      },
      statistics: {
        aboutUser: { followers: {}, followings: {} },
        aboutBlogs: {
          publishes: {},
          favourites: {},
        },
      },
    });

    const credentials = {
      _id: mongoResponse.insertedId,
      firstName,
      lastName,
      email,
      profileImage,
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
      credentials,
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { signup };
