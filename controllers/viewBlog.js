const { ObjectId } = require("mongodb");
const { getDatabase } = require("../database/mogoDb");

const viewBlog = async function (request, response, next) {
  try {
    const { userId, blogId, date } = request.body;
    const blogsCollection = getDatabase().collection("blogs");

    await blogsCollection.updateOne(
      { _id: ObjectId(blogId) },
      { $set: { ["views." + userId]: date } }
    );

    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { viewBlog };
