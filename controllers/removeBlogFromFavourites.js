const { ObjectId } = require("mongodb");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");
const { USERS_COLLECTION_NAME } = require("../constants");

async function removeBlogFromFavourites(userId, blogId) {
  const filterForUpdatingUserData = { _id: ObjectId(userId) };
  const userUpdateWithFilter = {
    $unset: { ["statistics.aboutBlogs.favourites." + blogId]: 1 },
  };

  await updateDataInCollection(
    USERS_COLLECTION_NAME,
    filterForUpdatingUserData,
    userUpdateWithFilter
  );

  return { blogId, userId };
}

module.exports = { removeBlogFromFavourites };
