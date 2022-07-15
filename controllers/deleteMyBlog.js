const { ObjectId } = require("mongodb");
const {
  USERS_COLLECTION_NAME,
  BLOGS_COLLECTION_NAME,
} = require("../constants");
const {
  deleteDataFromCollection,
} = require("./helpers/deleteDataFromCollection");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function deleteMyBlog({ userId, blogId }) {
  const filterForFetchingBlog = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForFetchingBlog,
  });

  if (blogData.publisherId.toString() !== userId)
    throw new Error("You can not delete someone else published blog.");

  const filterForDeletingBlog = { _id: ObjectId(blogId) };
  await deleteDataFromCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForDeletingBlog,
  });

  const filterForUpdatingUser = { _id: ObjectId(userId) };
  const userUpdateWithQuery = {
    $unset: { ["statistics.aboutBlogs.publishes." + blogId]: 1 },
  };

  const response = await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUser,
    dataWithQuery: userUpdateWithQuery,
  });

  return { blogId, userId };
}

module.exports = { deleteMyBlog };
