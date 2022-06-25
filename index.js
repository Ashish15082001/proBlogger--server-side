const express = require("express");
const { fetchBlogs } = require("./controllers/blogs entities/blogsEntities");
const { fetchMyBlogs } = require("./controllers/blogs entities/fetchMyBlogs");
const { client, setDatabase } = require("./database/mogoDb");
const app = express();
const cors = require("cors");
const port = 3001;
const { signup } = require("./controllers/auth/signup");
const { login } = require("./controllers/auth/login");
const { verifyAuthentication } = require("./middlewares/verifyAuthentication");
const { fetchUserData } = require("./controllers/fetchUserData");
const {
  fetchFavouriteBlogs,
} = require("./controllers/blogs entities/fetchFavouriteBlogs");
const { fileFilter, storage } = require("./utilities/multerConfigure");
const multer = require("multer");
const { publishBlog } = require("./controllers/publishBlog");
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
} = require("./constants");

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
  response.sendFile(
    `E:/Github Respository/proBlogger--server-side/uploads/images/${imageName}`
  );
});

app.post(POST_URL_SIGNUP, parser.any(), signup);
app.post(POST_URL_LOGIN, parser.any(), login);

app.post(
  POST_URL_BLOG_PUBLISH,
  parser.any(),
  verifyAuthentication,
  publishBlog
);

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
