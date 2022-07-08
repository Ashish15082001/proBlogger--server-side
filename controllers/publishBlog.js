const { ObjectId } = require("mongodb");
const {
  insertDataIntoCollection,
} = require("./helpers/insertDataIntoCollection");
const {
  BLOGS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} = require("../constants");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function publishBlog(userId, blogData, blogProfileImage) {
  const newBlogData = {
    ...blogData,
    publisherId: ObjectId(userId),
    blogProfileImage,
    views: {},
    comments: {},
    likes: {},
  };
  const blogInsertionResponse = await insertDataIntoCollection(
    BLOGS_COLLECTION_NAME,
    newBlogData
  );
  const insertedBlogId = blogInsertionResponse.insertedId;
  const filterForUpdatingUserData = { _id: ObjectId(userId) };
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.publishes." + insertedBlogId.toString()]:
        insertedBlogId,
    },
  };

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithQuery
  );

  return { message: "blog published successfully" };
}

module.exports = { publishBlog };
