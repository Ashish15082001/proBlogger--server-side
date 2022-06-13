const jwt = require("jsonwebtoken");

const { getDatabase } = require("../../../database/mogoDb");

const login = async function (request, response, next) {
  try {
    const { email, password } = request.body.user;

    const usersCollection = getDatabase().collection("users");
    const userData = await usersCollection.findOne({ email });

    if (!userData) throw new Error("user does not exists.");
    if (userData.password !== password) throw new Error("Invalid password.");

    const token = jwt.sign(
      {
        userId: userData._id.toString(),
      },
      "ashishsinghsecret",
      { expiresIn: "1h" }
    );

    response.json({
      isError: false,
      token,
      payload: { ...userData, password: undefined },
    });
  } catch (error) {
    response.json({ isError: true, description: error.message });
  }
};

module.exports = { login };
