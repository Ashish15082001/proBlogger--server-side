const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

const removeBlogFromFavourites = async function (request, response, next) {
  try {
    const { userId, blogId } = request.params;
    const usersCollection = getDatabase().collection("users");

    await usersCollection.updateOne(
      { _id: ObjectId(userId) },
      { $unset: { ["statistics.aboutBlogs.favourites." + blogId]: 1 } }
    );

    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { removeBlogFromFavourites };
