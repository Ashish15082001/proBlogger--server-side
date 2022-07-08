const { ObjectId } = require("mongodb");
const {
  BLOGS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} = require("../constants");
const { getDatabase } = require("../database/mogoDb");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

// if user has not liked specific blog, like the blog
// if user has already liked specific blog, unlike the blog
async function likeBlog(userId, blogId, date) {
  const filterForFetchingBlogData = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection(
    BLOGS_COLLECTION_NAME,
    filterForFetchingBlogData
  );
  const publisherId = blogData.publisherId;
  const userUpdate = {
    userId: ObjectId(userId),
    blogId: ObjectId(blogId),
  };
  const filterForUpdatingUserData = { _id: ObjectId(publisherId) };
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.totalLikes." + userId]: userUpdate,
    },
  };

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithQuery
  );

  const blogUpdate = {
    userId: ObjectId(userId),
    date,
  };
  const filterForUpdatingBlogData = { _id: ObjectId(blogId) };
  const blogUpdateWithQuery = {
    $set: { ["likes." + userId]: blogUpdate },
  };

  await updateDataInCollection(
    BLOGS_COLLECTION_NAME,
    filterForUpdatingBlogData,
    blogUpdateWithQuery
  );

  return { blogId, userId };
}

module.exports = { likeBlog };
