const { ObjectId } = require("mongodb");
const { getDatabase } = require("../../database/mogoDb");

// - extract id(user id) from url search/query params
// - check if id exists
// - if user/id exists in the database send user data

const fetchUserData = async function (request, response, next) {
  try {
    const { id } = request.query;

    if (!id)
      throw new Error(
        "Please add user id as a search params in the current url."
      );

    const usersCollection = getDatabase().collection("users");
    const userData = await usersCollection.findOne({ _id: ObjectId(id) });

    if (!userData) throw new Error("User does not exists.");

    response.json({
      payload: { ...userData, password: undefined, blogs: undefined },
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchUserData };
