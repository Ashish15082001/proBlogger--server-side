const { ObjectId } = require("mongodb");
const {
  USERS_COLLECTION_NAME,
  BLOGS_COLLECTION_NAME,
} = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function viewBlog(userId, blogId, date) {
  const filterForFetchingBlogData = { _id: ObjectId(blogId) };
  const blogData = await fetchDataFromCollection(
    "blogs",
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
      ["statistics.aboutBlogs.totalViews." + userId]: userUpdate,
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
    $set: {
      ["views." + userId]: blogUpdate,
    },
  };

  await updateDataInCollection(
    BLOGS_COLLECTION_NAME,
    filterForUpdatingBlogData,
    blogUpdateWithQuery
  );

  return { blogId, userId };
}

module.exports = { viewBlog };
