const express = require("express");
const { fetchBlogs } = require("./controllers/blogs entities/blogsEntities");
const { client, setDatabase } = require("./database/mogoDb");
const app = express();
const port = 3001;
const { signup } = require("./controllers/auth/signup");
const { login } = require("./controllers/auth/login");
const { verifyAuthentication } = require("./middlewares/verifyAuthentication");
const { fetchUserData } = require("./controllers/blogs entities/fetchUserData");
const {
  fetchFavouriteBlogs,
} = require("./controllers/blogs entities/fetchFavouriteBlogs");
const { fileFilter, storage } = require("./utilities/multerConfigure");
const multer = require("multer");
const { response } = require("express");

const parser = multer({ storage, fileFilter });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/trending", fetchBlogs);
app.get("/blogs", fetchBlogs);

app.post("/signUp", parser.any(), signup);
app.post("/logIn", login);
app.post("/logIn", login);
app.get("/userData", verifyAuthentication, fetchUserData);
app.get("/user/:userId/favourites", verifyAuthentication, fetchFavouriteBlogs);
app.get("/uploads/images/:imageName", (request, response, next) => {
  const { imageName } = request.params;

  response.sendFile(
    `E:/Github Respository/proBlogger--server-side/uploads/images/${imageName}`
  );
});

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

// console.log(JSON.stringify(blogsEntities),'');
