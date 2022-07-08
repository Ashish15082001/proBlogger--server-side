const { ObjectId } = require("mongodb");
const {
  USERS_COLLECTION_NAME,
  BLOGS_COLLECTION_NAME,
} = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function unLikeBlog(userId, blogId) {
  const filterForFetchingBlogData = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection(
    BLOGS_COLLECTION_NAME,
    filterForFetchingBlogData
  );
  const publisherId = blogData.publisherId;
  const filterForUpdatingUserData = { _id: ObjectId(publisherId) };
  const userUpdateWithQuery = {
    $unset: {
      ["statistics.aboutBlogs.totalLikes." + userId]: 1,
    },
  };

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithQuery
  );

  const filterForUpdatingBlogData = { _id: ObjectId(blogId) };
  const blogUpdateWithQuery = { $unset: { ["likes." + userId]: 1 } };

  await updateDataInCollection(
    BLOGS_COLLECTION_NAME,
    filterForUpdatingBlogData,
    blogUpdateWithQuery
  );

  return { blogId, userId };
}

module.exports = { unLikeBlog };
