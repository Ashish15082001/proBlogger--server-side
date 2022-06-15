const { getDatabase } = require("../../database/mogoDb");

const pageSizeLimit = 10;

const fetchBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;

    if (!pageNumber)
      throw new Error("Please add page number as a search params.");

    const pageNumberInt = +pageNumber;

    const blogsCollection = getDatabase().collection("blogs");
    const blogsArray = await blogsCollection
      .find()
      .skip(pageSizeLimit * (pageNumberInt - 1))
      .limit(pageSizeLimit)
      .toArray();
    const totalDocuments = await blogsCollection.countDocuments();
    const blogs = { entities: {} };
    const payload = { blogs, totalDocuments };

    for (let i = 0; i < blogsArray.length; i++) {
      const id = blogsArray[i]._id.toString();
      blogs.entities[id] = blogsArray[i];
    }

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchBlogs };
