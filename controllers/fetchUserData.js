const { ObjectId } = require("mongodb");
const { getDatabase } = require("../database/mogoDb");

// - extract id(user id) from url search/query params
// - check if id exists
// - if user/id exists in the database send user data
const fetchUserData = async function (request, response, next) {
  try {
    const { userId } = request.params;

    if (!userId)
      throw new Error("Please add user id as a params in the current url.");

    const usersCollection = getDatabase().collection("users");
    const userData = await usersCollection.findOne({ _id: ObjectId(userId) });
    const totalViews = {};
    const totalLikes = {};
    const totalComments = {};
    const trendings = {};

    if (!userData) throw new Error("User does not exists.");

    response.json({
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
    });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchUserData };
