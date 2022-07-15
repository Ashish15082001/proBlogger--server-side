const { ObjectId } = require("mongodb");
const {
  BLOGS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function publishComment({ userId, blogId, comment, date }) {
  const filterForFetchingBlogData = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForFetchingBlogData,
  });
  const publisherId = blogData.publisherId;
  const userUpdate = {
    userId: ObjectId(userId),
    blogId: ObjectId(blogId),
  };
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.totalComments." + userId]: userUpdate,
    },
  };
  const filterForUpdatingUserData = { _id: ObjectId(publisherId) };

  await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUserData,
    dataWithQuery: userUpdateWithQuery,
  });

  const blogUpdate = {
    userId: ObjectId(userId),
    comment,
    date,
  };
  const blogDataUpdateSetObject = {
    ["comments." + userId + ".commenterComments." + new Date(date).getTime()]:
      blogUpdate,
  };
  const blogUpdateWithQuery = {
    $set: blogDataUpdateSetObject,
  };
  const filterForUpdatingBlogData = { _id: ObjectId(blogId) };

  await updateDataInCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForUpdatingBlogData,
    dataWithQuery: blogUpdateWithQuery,
  });

  return { message: "comment published successfully" };
}

module.exports = { publishComment };
