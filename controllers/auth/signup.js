const jwt = require("jsonwebtoken");
const { USERS_COLLECTION_NAME } = require("../../constants");
const {
  fetchDataFromCollection,
} = require("../helpers/fetchDataFromCollection");
const {
  insertDataIntoCollection,
} = require("../helpers/insertDataIntoCollection");

/**
 *
 * @param {string} firstName - firstName of client
 * @param {string} lastName - lastName of client
 * @param {string} email - email of client
 * @param {string} password - password of client
 * @param {string} confirmedPassword - confirmedPassword of client
 * @param {Object} profileImage - profileImage of client
 * @returns {Promise}  user data as promise
 */
async function signup({
  firstName,
  lastName,
  email,
  password,
  confirmedPassword,
  profileImage,
}) {
  const filterForFetchingUserData = {
    ["credentials.email"]: email,
  };

  if (!profileImage) throw new Error("Please select valid image format.");

  const doesUserAlreadyExists = await fetchDataFromCollection({
    collectionName: USERS_COLLECTION_NAME,
    filter: filterForFetchingUserData,
  });

  if (doesUserAlreadyExists) {
    throw new Error("user already exists.");
  }

  const statistics = {
    aboutUser: { followers: {}, followings: {} },
    aboutBlogs: {
      favourites: {},
      publishes: {},
      totalViews: {},
      totalComments: {},
      totalLikes: {},
      trendings: {},
    },
  };
  const newUserdata = {
    credentials: {
      firstName,
      lastName,
      email,
      password,
      profileImage,
    },
    statistics,
  };
  const insertionResponse = await insertDataIntoCollection({
    collectionName: USERS_COLLECTION_NAME,
    data: newUserdata,
  });
  const credentials = {
    _id: insertionResponse.insertedId,
    firstName,
    lastName,
    email,
    profileImage,
  };
  const token = jwt.sign(
    {
      userId: insertionResponse.insertedId.toString(),
    },
    "ashishsinghsecret",
    { expiresIn: "1h" }
  );
  const payload = {
    token,
    credentials,
    statistics,
  };

  return payload;
}

module.exports = { signup };

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
