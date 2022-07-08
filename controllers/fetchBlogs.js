const { ObjectId } = require("mongodb");
const { PAGE_SIZE_LIMIT } = require("../constants");
const { getDatabase } = require("../database/mogoDb");

async function fetchBlogs(pageNumber) {
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
    const blogId = blogsArray[i]._id;

    const entity = blogsArray[i];

    const publisherId = entity.publisherId;
    const userData = await usersCollection.findOne({ _id: publisherId });
    const userCredentials = userData.credentials;
    const publisherName =
      userCredentials.firstName + " " + userCredentials.lastName;
    const publisherProfileImage = userCredentials.profileImage;

    entity.publisherName = publisherName;
    entity.publisherProfileImage = publisherProfileImage;

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

    entities[blogId] = entity;
  }
  return payload;
}

module.exports = { fetchBlogs };

/*
  on success function should return
   
{ 
  entities: {
    blogId: {
      _id,
      blogTitle,
      aboutBlog,
      publisherId,
      blogProfileImage,
      comments: {},
      like: {},
      views: {},
      date,
      publisherName,
      publisherProfileImage,
    } ,
    ...
  },
  totalDocuments,
}

*/
