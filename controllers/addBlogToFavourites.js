const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

const addBlogToFavourites = async function (request, response, next) {
  try {
    const { userId, blogId } = request.params;
    const { date } = request.body;
    const usersCollection = getDatabase().collection("users");

    await usersCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          ["statistics.aboutBlogs.favourites." + blogId]: {
            blogId: ObjectId(blogId),
            date,
          },
        },
      }
    );

    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { addBlogToFavourites };
