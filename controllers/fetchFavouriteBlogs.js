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
    const userData = await usersCollection.findOne({
      _id: ObjectId(userId),
    });
    const userStatistics = userData.statistics;
    const favouriteBlogsIdArray = Object.values(
      userStatistics.aboutBlogs.favourites
    ).map((favouritesBlogs) => favouritesBlogs.blogId);

    const favouriteBlogsArray = await blogsCollection
      .find({ _id: { $in: favouriteBlogsIdArray } })
      .skip(PAGE_SIZE_LIMIT * (pageNumberInt - 1))
      .limit(PAGE_SIZE_LIMIT)
      .toArray();

    const totalDocuments = favouriteBlogsArray.length;
    const entities = {};
    const payload = { entities, totalDocuments };

    for (let i = 0; i < favouriteBlogsArray.length; i++) {
      const id = favouriteBlogsArray[i]._id.toString();
      entities[id] = favouriteBlogsArray[i];
    }

    for (const entity of Object.values(payload.entities)) {
      const userData = await usersCollection.findOne({
        _id: entity.publisherId,
      });
      const userCredentials = userData.credentials;
      entity.publisherName =
        userCredentials.firstName + " " + userCredentials.lastName;
      entity.publisherProfileImage = userCredentials.profileImage;

      for (const commenterUserId of Object.keys(entity.comments)) {
        const commenterData = await usersCollection.findOne({
          _id: ObjectId(commenterUserId),
        });
        const commenterCredentials = commenterData.credentials;
        const commenterName =
          commenterCredentials.firstName + " " + commenterCredentials.lastName;
        const commenterProfileImage = commenterCredentials.profileImage;

        entity.comments[commenterUserId].commenterName = commenterName;
        entity.comments[commenterUserId].commenterProfileImage =
          commenterProfileImage;
      }
    }

    console.log(payload);
    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchFavouriteBlogs };
