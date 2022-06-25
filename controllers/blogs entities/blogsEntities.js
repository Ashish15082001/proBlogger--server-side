const { PAGE_SIZE_LIMIT } = require("../../constants");
const { getDatabase } = require("../../database/mogoDb");

const fetchBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;

    if (!pageNumber)
      throw new Error("Please add page number as a search params.");

    const pageNumberInt = +pageNumber;

    const blogsCollection = getDatabase().collection("blogs");
    const usersCollection = getDatabase().collection("users");

    const blogsArray = await blogsCollection
      .find()
      .skip(PAGE_SIZE_LIMIT * (pageNumberInt - 1))
      .limit(PAGE_SIZE_LIMIT)
      .toArray();
    const totalDocuments = await blogsCollection.countDocuments();
    const entities = {};
    const payload = { entities, totalDocuments };

    for (let i = 0; i < blogsArray.length; i++) {
      const id = blogsArray[i]._id.toString();
      entities[id] = blogsArray[i];
    }

    for (const entity of Object.values(payload.entities)) {
      // console.log(entity);
      const publisherId = entity.publisherId;
      const userData = await usersCollection.findOne({ _id: publisherId });
      entity.publisherName = userData.firstName + " " + userData.lastName;
      entity.publisherProfileImage = userData.profileImage;
    }

    // console.log(payload);
    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchBlogs };
