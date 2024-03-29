const { ObjectId } = require("mongodb");
const {
  insertDataIntoCollection,
} = require("./helpers/insertDataIntoCollection");
const {
  BLOGS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} = require("../constants");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function publishBlog({ userId, blogData }) {
  const newBlogData = {
    ...blogData,
    publisherId: ObjectId(userId),
    views: {},
    comments: {},
    likes: {},
  };
  const blogInsertionResponse = await insertDataIntoCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    data: newBlogData,
  });
  const insertedBlogId = blogInsertionResponse.insertedId;
  const filterForUpdatingUserData = { _id: ObjectId(userId) };
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.publishes." + insertedBlogId.toString()]:
        insertedBlogId,
    },
  };

  await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUserData,
    dataWithQuery: userUpdateWithQuery,
  });

  return { message: "blog published successfully" };
}

module.exports = { publishBlog };
