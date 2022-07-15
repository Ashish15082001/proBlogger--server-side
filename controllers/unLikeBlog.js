const { ObjectId } = require("mongodb");
const {
  USERS_COLLECTION_NAME,
  BLOGS_COLLECTION_NAME,
} = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function unLikeBlog({ userId, blogId }) {
  const filterForFetchingBlogData = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForFetchingBlogData,
  });
  const publisherId = blogData.publisherId;
  const filterForUpdatingUserData = { _id: ObjectId(publisherId) };
  const userUpdateWithQuery = {
    $unset: {
      ["statistics.aboutBlogs.totalLikes." + userId]: 1,
    },
  };

  await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUserData,
    dataWithQuery: userUpdateWithQuery,
  });

  const filterForUpdatingBlogData = { _id: ObjectId(blogId) };
  const blogUpdateWithQuery = { $unset: { ["likes." + userId]: 1 } };

  await updateDataInCollection({
    collectionName: BLOGS_COLLECTION_NAME,
    filter: filterForUpdatingBlogData,
    dataWithQuery: blogUpdateWithQuery,
  });

  return { blogId, userId };
}

module.exports = { unLikeBlog };
