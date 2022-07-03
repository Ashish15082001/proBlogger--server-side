const { ObjectId } = require("mongodb");
const { getDatabase } = require("../database/mogoDb");

const publishComment = async function (request, response, next) {
  try {
    const { userId, blogId, comment, date } = request.body;
    const blogsCollection = getDatabase().collection("blogs");
    const blog = await blogsCollection.findOne({ _id: ObjectId(blogId) });

    if (blog.comments[userId])
      await blogsCollection.updateOne(
        { _id: ObjectId(blogId) },
        {
          $set: {
            ["comments." + userId]: {
              userId: ObjectId(userId),
              date,
              comment: blog.comments[userId].comment + " " + comment,
            },
          },
        }
      );
    else
      await blogsCollection.updateOne(
        { _id: ObjectId(blogId) },
        { $set: { ["comments." + userId]: { date, comment } } }
      );
    response.json({ blogId });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { publishComment };
