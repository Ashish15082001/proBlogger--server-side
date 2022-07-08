const { PAGE_SIZE_LIMIT } = require("../constants");
const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

// fetch blogs fom database and add few extra properties to each blog before sending response back to user.
// add publisher name and publisher profile image properies.
 async function fetchFavouriteBlogs(request, response, next) {
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
      const blogId = favouriteBlogsArray[i]._id.toString();
      // entity is individual blog document
      const entity = favouriteBlogsArray[i];

      // adding publisher full name and profile image
      // using publisherId as a userId and fething publisher data from database
      // in order to extract profileImage, firstname and lastName
      const publisherId = entity.publisherId;
      const userData = await usersCollection.findOne({ _id: publisherId });
      const userCredentials = userData.credentials;
      const publisherName =
        userCredentials.firstName + " " + userCredentials.lastName;
      const publisherProfileImage = userCredentials.profileImage;

      // adding publisher full and publisher profile image to entity
      entity.publisherName = publisherName;
      entity.publisherProfileImage = publisherProfileImage;

      // adding all commenters full name and profile image to comment data
      for (const commenterUserId of Object.keys(entity.comments)) {
        // using commenterId as userId to fetch commenter data from database
        const commenterData = await usersCollection.findOne({
          _id: ObjectId(commenterUserId),
        });
        const commenterCredentials = commenterData.credentials;
        const commenterName =
          commenterCredentials.firstName + " " + commenterCredentials.lastName;
        const commenterProfileImage = commenterCredentials.profileImage;

        // adding commenter full and commenter profile image to commentData of entity
        entity.comments[commenterUserId].commenterName = commenterName;
        entity.comments[commenterUserId].commenterProfileImage =
          commenterProfileImage;
      }

      entities[blogId] = entity;
    }

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchFavouriteBlogs };
