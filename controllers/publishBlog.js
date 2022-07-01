const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

const publishBlog = async function (request, response, next) {
  try {
    const { userId } = request.params;
    const blogData = request.body;
    const blogProfileImage = request.files[0];
    const blogsCollection = getDatabase().collection("blogs");
    const usersCollection = getDatabase().collection("users");
    const blogInsertionResponse = await blogsCollection.insertOne({
      ...blogData,
      publisherId: ObjectId(userId),
      timeOfPublish: new Date(),
      blogProfileImage,
      views: {},
      comments: {},
      likes: {},
    });
    const insertedBlogId = blogInsertionResponse.insertedId;
    await usersCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          ["aboutBlogs.publishes." + insertedBlogId.toString()]: insertedBlogId,
        },
      }
    );

    response.json({ insertedBlogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { publishBlog };
