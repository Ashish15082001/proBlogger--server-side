const { ObjectId } = require("mongodb");
const {
  BLOGS_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");

async function publishComment(userId, blogId, comment, date) {
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
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.totalComments." + userId]: userUpdate,
    },
  };
  const filterForUpdatingUserData = { _id: ObjectId(publisherId) };

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithQuery
  );

  const blogUpdate = blogData.comments[userId]
    ? {
        userId: ObjectId(userId),
        comment: blogData.comments[userId].comment + " " + comment,
        date,
      }
    : { userId: ObjectId(userId), date, comment };
  const blogUpdateWithQuery = {
    $set: {
      ["comments." + userId]: blogUpdate,
    },
  };
  const filterForUpdatingBlogData = { _id: ObjectId(blogId) };

  await updateDataInCollection(
    BLOGS_COLLECTION_NAME,
    filterForUpdatingBlogData,
    blogUpdateWithQuery
  );

  return { message: "comment published successfully" };
}

module.exports = { publishComment };
