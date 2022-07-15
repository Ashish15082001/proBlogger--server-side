const { ObjectId } = require("mongodb");
const { updateDataInCollection } = require("./helpers/updateDataInCollection");
const { USERS_COLLECTION_NAME } = require("../constants");

async function removeBlogFromFavourites({ userId, blogId }) {
  const filterForUpdatingUserData = { _id: ObjectId(userId) };
  const userUpdateWithFilter = {
    $unset: { ["statistics.aboutBlogs.favourites." + blogId]: 1 },
  };

  await updateDataInCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForUpdatingUserData,
    dataWithQuery: userUpdateWithFilter,
  });

  return { blogId, userId };
}

module.exports = { removeBlogFromFavourites };
