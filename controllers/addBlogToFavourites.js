const { ObjectId } = require("mongodb");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");
const { USERS_COLLECTION_NAME } = require("../constants");

async function addBlogToFavourites(userId, blogId, date) {
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

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithQuery
  );

  return { blogId, userId };
}

module.exports = { addBlogToFavourites };
