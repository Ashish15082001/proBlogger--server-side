const { getDatabase } = require("../../database/mogoDb");

const pageSizeLimit = 10;

const fetchBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;
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

    const responseData = { isError: false, payload };
    response.json(JSON.stringify(responseData));
  } catch (err) {
    console.log(err);
    const payload = err;
    const responseData = { isError: true, payload };

    response.json(JSON.stringify(responseData));
  }
};

module.exports = { fetchBlogs };
