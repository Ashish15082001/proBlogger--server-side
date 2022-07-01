const { ObjectId } = require("mongodb");
const { getDatabase } = require("../database/mogoDb");

// if user has not liked specific blog, like the blog
// if user has already liked specific blog, unlike the blog
const likeBlog = async function (request, response, next) {
  try {
    const { userId, blogId, date } = request.body;
    const blogsCollection = getDatabase().collection("blogs");
    const blogData = await blogsCollection.findOne({ _id: ObjectId(blogId) });

    if (blogData.likes[userId])
      await blogsCollection.updateOne(
        { _id: ObjectId(blogId) },
        { $unset: { ["likes." + userId]: 1 } }
      );
    else
      await blogsCollection.updateOne(
        { _id: ObjectId(blogId) },
        { $set: { ["likes." + userId]: date } }
      );

    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { likeBlog };
