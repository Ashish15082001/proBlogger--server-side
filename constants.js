const PAGE_SIZE_LIMIT = 10;

const GET_URL_TRENDING = "/trending";
const GET_URL_BLOGS = "/blogs";
const GET_URL_MY_BLOGS = "/user/:userId/myBlogs";
const GET_URL_USERDATA = "/userData";
const GET_URL_USER_FAVOURITES = "/user/:userId/favourites";
const GET_URL_IMAGE = "/uploads/images/:imageName";

const POST_URL_SIGNUP = "/signUp";
const POST_URL_LOGIN = "/logIn";
const POST_URL_BLOG_PUBLISH = "/user/:userId/publishBlog";

module.exports = {
  PAGE_SIZE_LIMIT,
  GET_URL_TRENDING,
  GET_URL_BLOGS,
  GET_URL_MY_BLOGS,
  GET_URL_USERDATA,
  GET_URL_USER_FAVOURITES,
  GET_URL_IMAGE,
  POST_URL_SIGNUP,
  POST_URL_LOGIN,
  POST_URL_BLOG_PUBLISH,
};
