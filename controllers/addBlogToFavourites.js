const { ObjectId } = require("mongodb");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");
const { USERS_COLLECTION_NAME } = require("../constants");

async function addBlogToFavourites({ userId, blogId, date }) {
  const userUpdate = {
    blogId: ObjectId(blogId),
    date,
  };
  const filterForUpdatingUserData = { _id: ObjectId(userId) };
  const userUpdateWithQuery = {
    $set: {
      ["statistics.aboutBlogs.favourites." + blogId]: userUpdate,
    },
  };

  await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUserData,
    dataWithQuery: userUpdateWithQuery,
  });

  return { blogId, userId };
}

module.exports = { addBlogToFavourites };
