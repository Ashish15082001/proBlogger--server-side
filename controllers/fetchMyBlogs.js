const { PAGE_SIZE_LIMIT } = require("../constants");
const { getDatabase } = require("../database/mogoDb");
const { ObjectId } = require("mongodb");

const fetchMyBlogs = async function (request, response, next) {
  try {
    const { pageNumber } = request.query;
    const { userId } = request.params;

    if (!pageNumber)
      throw new Error("Please add page number as a search params.");

    const pageNumberInt = +pageNumber;
    const blogsCollection = getDatabase().collection("blogs");
    const usersCollection = getDatabase().collection("users");
    const usersData = await usersCollection.findOne({
      _id: ObjectId(userId),
    });
    const myBlogsIdArray = Object.values(
      usersData.statistics.aboutBlogs.publishes
    );
    const myBlogsArray = await blogsCollection
      .find({ _id: { $in: myBlogsIdArray } })
      .skip(PAGE_SIZE_LIMIT * (pageNumberInt - 1))
      .limit(PAGE_SIZE_LIMIT)
      .toArray();
    const totalDocuments = myBlogsIdArray.length;
    const entities = {};
    const payload = { entities, totalDocuments };
    for (let i = 0; i < myBlogsArray.length; i++) {
      const id = myBlogsArray[i]._id.toString();
      entities[id] = myBlogsArray[i];
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

    response.json(payload);
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
};

module.exports = { fetchMyBlogs };
