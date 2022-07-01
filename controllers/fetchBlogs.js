const { ObjectId } = require("mongodb");
const { PAGE_SIZE_LIMIT } = require("../constants");
const { getDatabase } = require("../database/mogoDb");

// fetch blogs fom database and add few extra properties to each blog before sending response back to user.
// add publisher name and publisher profile image properies.
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

    console.log("hlo");
    for (const entity of Object.values(payload.entities)) {
      const publisherId = entity.publisherId;
      const userData = await usersCollection.findOne({ _id: publisherId });
      entity.publisherName = userData.firstName + " " + userData.lastName;
      entity.publisherProfileImage = userData.profileImage;

      for (const commenterUserId of Object.keys(entity.comments)) {
        const commenter = await usersCollection.findOne({
          _id: ObjectId(commenterUserId),
        });
        const commenterName = commenter.firstName + " " + commenter.lastName;
        const commenterProfileImage = commenter.profileImage;

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

module.exports = { fetchBlogs };