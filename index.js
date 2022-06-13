const express = require("express");
const { json } = require("express/lib/response");
const { fetchBlogs } = require("./controllers/blogs entities/blogsEntities");
const { client, setDatabase } = require("./database/mogoDb");
const { trendingBlogsEntities, blogsEntities } = require("./dummyData");
const app = express();
const port = 3001;
const bodyParser = require("body-parser");
const { signup } = require("./controllers/blogs entities/auth/signup");
const { login } = require("./controllers/blogs entities/auth/login");
const jsonParser = bodyParser.json();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(jsonParser);

app.get("/trending", fetchBlogs);

app.get("/blogs", fetchBlogs);

app.post("/signUp", signup);
app.post("/logIn", login);

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
