const { ObjectId } = require("mongodb");
const { getDatabase } = require("../database/mogoDb");

const unLikeBlog = async function (request, response, next) {
  try {
    const { userId, blogId } = request.body;
    const blogsCollection = getDatabase().collection("blogs");
    await blogsCollection.updateOne(
      { _id: ObjectId(blogId) },
      { $unset: { ["likes." + userId]: 1 } }
    );
    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { unLikeBlog };
