const { getDatabase } = require("../../database/mogoDb");

const pageSizeLimit = 10;

const fetchFavouriteBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;

    // console.log(pageNumber)

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
    const entities = {};
    const payload = { entities, totalDocuments };

    for (let i = 0; i < blogsArray.length; i++) {
      const id = blogsArray[i]._id.toString();
      entities[id] = blogsArray[i];
    }
    // console.log(payload);
    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchFavouriteBlogs };
