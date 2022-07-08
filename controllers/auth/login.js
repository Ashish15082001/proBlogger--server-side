const jwt = require("jsonwebtoken");
const { USERS_COLLECTION_NAME } = require("../../constants");
const {
  fetchDataFromCollection,
} = require("../helpers/fetchDataFromCollection");

/**
 *
 * @param {string} email - email of client
 * @param {string} password - password of client
 * @returns {Promise}  user data as promise
 */
async function login(email, password) {
  const filterForFetchingUserData = {
    "credentials.email": email,
  };
  const userData = await fetchDataFromCollection(
    USERS_COLLECTION_NAME,
    filterForFetchingUserData
  );

  if (!userData) throw new Error("user does not exists.");

  const userCredentials = userData.credentials;

  if (userCredentials.password !== password)
    throw new Error("Invalid password.");

  const token = jwt.sign(
    {
      userId: userData._id.toString(),
    },
    "ashishsinghsecret",
    { expiresIn: "1h" }
  );
  const payload = {
    token,
    credentials: {
      ...userCredentials,
      _id: userData._id,
      password: undefined,
    },
    statistics: userData.statistics,
  };

  return payload;
}

module.exports = { login };

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
      totalComments: {...},
      totalLikes: {...},
      totalViews: {...}
      trendings: {...}
    },
    aboutUser: {
      followers: {...},
      followings: {...}
    }
  },
  token,
}

*/
