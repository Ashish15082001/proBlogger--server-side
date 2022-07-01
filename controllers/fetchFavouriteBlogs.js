const { PAGE_SIZE_LIMIT } = require("../constants");
const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

// fetch blogs fom database and add few extra properties to each blog before sending response back to user.
// add publisher name and publisher profile image properies.
const fetchFavouriteBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;
    const { userId } = request.params;

    if (!pageNumber)
      throw new Error("Please add page number as a search params.");

    const pageNumberInt = +pageNumber;
    const blogsCollection = getDatabase().collection("blogs");
    const usersCollection = getDatabase().collection("users");
    const usersResponse = await usersCollection.findOne({
      _id: ObjectId(userId),
    });
    const favouriteBlogsIdArray = Object.values(
      usersResponse.aboutBlogs.favourites
    );
    const favouriteBlogsArray = await blogsCollection
      .find({ _id: { $in: favouriteBlogsIdArray } })
      .skip(PAGE_SIZE_LIMIT * (pageNumberInt - 1))
      .limit(PAGE_SIZE_LIMIT)
      .toArray();
    const totalDocuments = favouriteBlogsIdArray.length;
    const entities = {};
    const payload = { entities, totalDocuments };

    for (let i = 0; i < favouriteBlogsArray.length; i++) {
      const id = favouriteBlogsArray[i]._id.toString();
      entities[id] = favouriteBlogsArray[i];
    }

    for (const entity of Object.values(payload.entities)) {
      const userData = usersResponse;
      entity.publisherName = userData.firstName + " " + userData.lastName;
      entity.publisherProfileImage = userData.profileImage;
    }

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchFavouriteBlogs };
