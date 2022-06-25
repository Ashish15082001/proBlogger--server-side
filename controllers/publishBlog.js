const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

const publishBlog = async function (request, response, next) {
  try {
    const { userId } = request.params;
    const blogData = request.body;
    const blogProfileImage = request.files[0];

    //   console.log(blogData);

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

    // if (blogInsertionResponse.acknowledged === false)
    //   throw new Error("blog publishment failed.");

    const insertedBlogId = blogInsertionResponse.insertedId;

    const userUpdationResponse = await usersCollection.updateOne(
      { _id: ObjectId(userId) },
      {
        $set: {
          ["aboutBlogs.publishes." + insertedBlogId.toString()]: insertedBlogId,
        },
      }
    );

    // console.log(blogInsertionResponse);
    // console.log(userUpdationResponse);
    // if (userUpdationResponse.acknowledged === false)
    //   throw new Error("user updation failed insertion failed.");

    response.json({ insertedBlogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { publishBlog };
