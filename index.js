const {
  GET_URL_TRENDING,
  GET_URL_BLOGS,
  POST_URL_SIGNUP,
  POST_URL_LOGIN,
  GET_URL_USERDATA,
  GET_URL_IMAGE,
  POST_URL_BLOG_PUBLISH,
  GET_URL_MY_BLOGS,
  POST_URL_LIKE_BLOG,
  POST_URL_VIEW_BLOG,
  POST_URL_PUBLISH_COMMENT,
  POST_URL_ADD_BLOG_TO_FAVOURITES,
  POST_URL_REMOVE_BLOG_FROM_FAVOURITES,
  GET_URL_USER_FAVOURITES_BLOGS,
  POST_URL_UNLIKE_BLOG,
  POST_URL_DELETE_MY_BLOG,
} = require("./constants");
const express = require("express");
const { fetchMyBlogs } = require("./controllers/fetchMyBlogs");
const { client, setDatabase } = require("./database/mogoDb");
const app = express();
const cors = require("cors");
const { verifyAuthentication } = require("./middlewares/verifyAuthentication");
const { fetchFavouriteBlogs } = require("./controllers/fetchFavouriteBlogs");
const { fileFilter, storage } = require("./utilities/multerConfigure");
const multer = require("multer");
const { fetchBlogs } = require("./controllers/fetchBlogs");
const bodyParser = require("body-parser");
const {
  handleLoginRequest,
} = require("./controllers/handlers/handleLoginRequest");
const {
  handleSignupRequest,
} = require("./controllers/handlers/handleSignupRequest");
const {
  handleViewBlogRequest,
} = require("./controllers/handlers/handleViewBlogRequest");
const { handleLikeBlog } = require("./controllers/handlers/handleLikeBlog");
const { handleUnlikeBlog } = require("./controllers/handlers/handleUnlikeBlog");
const {
  handleAddBlogToFavourites,
} = require("./controllers/handlers/handleAddBlogToFavourites");
const {
  handleRemoveBlogFromFavourites,
} = require("./controllers/handlers/handleRemoveBlogFromFavourites");
const {
  handleFetchUserData,
} = require("./controllers/handlers/handleFetchUserData");
const {
  handlePublishComment,
} = require("./controllers/handlers/handlePublishComment");
const {
  handlePublishBlog,
} = require("./controllers/handlers/handlePublishBlog");
const { handleFetchBlogs } = require("./controllers/handlers/handleFetchBlogs");
const {
  handleDeleteMyBlogRequest,
} = require("./controllers/handlers/handleDeleteMyBlogRequest");
const path = require("path");

const parser = multer({ storage, fileFilter });

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get(GET_URL_TRENDING, handleFetchBlogs);
app.get(GET_URL_BLOGS, handleFetchBlogs);
app.get(GET_URL_MY_BLOGS, verifyAuthentication, fetchMyBlogs);
app.get(GET_URL_USERDATA, verifyAuthentication, handleFetchUserData); // TESTING DONE ##################
app.get(
  GET_URL_USER_FAVOURITES_BLOGS,
  verifyAuthentication,
  fetchFavouriteBlogs
);

app.get(GET_URL_IMAGE, (request, response, next) => {
  const { imageName } = request.params;
  const imageAbsolutePath = path.join(
    __dirname,
    "uploads",
    "images",
    imageName
  );
  response.sendFile(imageAbsolutePath);
});

app.post(POST_URL_SIGNUP, parser.any(), handleSignupRequest); // TESTING DONE ##################
app.post(POST_URL_LOGIN, parser.any(), handleLoginRequest); // TESTING DONE ##################
app.post(
  POST_URL_BLOG_PUBLISH,
  bodyParser.json(),
  verifyAuthentication,
  handlePublishBlog
);
app.post(
  POST_URL_LIKE_BLOG,
  bodyParser.json(),
  verifyAuthentication,
  handleLikeBlog
); // TESTING DONE ##################
app.post(
  POST_URL_UNLIKE_BLOG,
  bodyParser.json(),
  verifyAuthentication,
  handleUnlikeBlog
); // TESTING DONE ##################
app.post(
  POST_URL_VIEW_BLOG,
  bodyParser.json(),
  verifyAuthentication,
  handleViewBlogRequest
); // TESTING DONE ##################
app.post(
  POST_URL_PUBLISH_COMMENT,
  bodyParser.json(),
  verifyAuthentication,
  handlePublishComment
);
app.post(
  POST_URL_ADD_BLOG_TO_FAVOURITES,
  verifyAuthentication,
  bodyParser.json(),
  handleAddBlogToFavourites
); // TESTING DONE ##################
app.post(
  POST_URL_REMOVE_BLOG_FROM_FAVOURITES,
  verifyAuthentication,
  handleRemoveBlogFromFavourites
); // TESTING DONE ##################

app.post(
  POST_URL_DELETE_MY_BLOG,
  verifyAuthentication,
  handleDeleteMyBlogRequest
);

const port = process.env.PORT || 80;
// const port = 3001;

const establishDatabaseAndServerConnection = async function () {
  try {
    await client.connect();
    setDatabase(client.db("ProBlogger"));

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
      // setTimeout(function jagteRaho() {
      //   console.log("jaagte rahoo...");
      //   setTimeout(jagteRaho, 1000 * 60);
      // }, 1000 * 60);
    });
  } catch (err) {
    console.log(err);
  }
};

establishDatabaseAndServerConnection();
