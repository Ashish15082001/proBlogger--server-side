const { ObjectId } = require("mongodb");
const { USERS_COLLECTION_NAME } = require("../constants");
const {
  fetchDataFromCollection,
} = require("./helpers/fetchDataFromCollection");

// - extract id(user id) from url search/query params
// - check if id exists
// - if user/id exists in the database send user data
async function fetchUserData({ userId }) {
  if (!userId)
    throw new Error("Please add user id as a params in the current url.");

  const filterForFetchingUserData = { _id: ObjectId(userId) };
  const userData = await fetchDataFromCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForFetchingUserData,
  });

  if (!userData) throw new Error("User does not exists.");

  const credentials = {
    ...userData.credentials,
    password: undefined,
    _id: userData._id,
  };

  return { credentials, statistics: userData.statistics };
}

module.exports = { fetchUserData };

/*
  on success function should return
   
{ 
  credentials: {
    _id,
    email,
    firstName
    lastName,
    profileImage: {}
  },
  statistics: {
    aboutBlogs: {
      favourites: {...},
      publishes: {...},
      totalViews: {...}
      totalComments: {...},
      totalLikes: {...},
      trendings: {...}
    },
    aboutUser: {
      followers: {...},
      followings: {...}
    }
  }  
}

*/
