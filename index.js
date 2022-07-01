const express = require("express");
const { fetchMyBlogs } = require("./controllers/fetchMyBlogs");
const { client, setDatabase } = require("./database/mogoDb");
const app = express();
const cors = require("cors");
const { signup } = require("./controllers/auth/signup");
const { login } = require("./controllers/auth/login");
const { verifyAuthentication } = require("./middlewares/verifyAuthentication");
const { fetchUserData } = require("./controllers/fetchUserData");
const { fetchFavouriteBlogs } = require("./controllers/fetchFavouriteBlogs");
const { fileFilter, storage } = require("./utilities/multerConfigure");
const multer = require("multer");
const { publishBlog } = require("./controllers/publishBlog");
const { fetchBlogs } = require("./controllers/fetchBlogs");
const bodyParser = require("body-parser");
const {
  GET_URL_TRENDING,
  GET_URL_BLOGS,
  POST_URL_SIGNUP,
  POST_URL_LOGIN,
  GET_URL_USERDATA,
  GET_URL_USER_FAVOURITES,
  GET_URL_IMAGE,
  POST_URL_BLOG_PUBLISH,
  GET_URL_MY_BLOGS,
  POST_URL_LIKE_BLOG,
  POST_URL_VIEW_BLOG,
  PSOT_URL_PUBLISH_COMMENT,
} = require("./constants");
const { likeBlog } = require("./controllers/likeBlog");
const { viewBlog } = require("./controllers/viewBlog");
const { publishComment } = require("./controllers/publishComment");

const parser = multer({ storage, fileFilter });

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get(GET_URL_TRENDING, (request, response, next) => {
  console.log("trending...");
  fetchBlogs(request, response, next);
});
app.get(GET_URL_BLOGS, (request, response, next) => {
  console.log("blogs...");
  fetchBlogs(request, response, next);
});
app.get(GET_URL_MY_BLOGS, verifyAuthentication, (request, response, next) => {
  console.log("my blogs...");
  fetchMyBlogs(request, response, next);
});
app.get(GET_URL_USERDATA, verifyAuthentication, fetchUserData);
app.get(
  GET_URL_USER_FAVOURITES,
  verifyAuthentication,
  (request, response, next) => {
    console.log("favourites...");
    fetchFavouriteBlogs(request, response, next);
  }
);

app.get(GET_URL_IMAGE, (request, response, next) => {
  const { imageName } = request.params;
  response.sendFile(`${__dirname}/uploads/images/${imageName}`);
});

app.post(POST_URL_SIGNUP, parser.any(), signup);
app.post(POST_URL_LOGIN, parser.any(), login);

app.post(
  POST_URL_BLOG_PUBLISH,
  parser.any(),
  verifyAuthentication,
  publishBlog
);

app.post(POST_URL_LIKE_BLOG, bodyParser.json(), verifyAuthentication, likeBlog);
app.post(POST_URL_VIEW_BLOG, bodyParser.json(), verifyAuthentication, viewBlog);
app.post(
  PSOT_URL_PUBLISH_COMMENT,
  bodyParser.json(),
  verifyAuthentication,
  publishComment
);

const port = process.env.PORT || 80;
// const port = 3001;

const establishDatabaseAndServerConnection = async function () {
  try {
    await client.connect();
    setDatabase(client.db("ProBlogger"));

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

establishDatabaseAndServerConnection();
