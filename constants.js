const PAGE_SIZE_LIMIT = 10;

const GET_URL_TRENDING = "/trending";
const GET_URL_BLOGS = "/blogs";
const GET_URL_MY_BLOGS = "/user/:userId/myBlogs";
const GET_URL_USERDATA = "/user/:userId/data";
const GET_URL_USER_FAVOURITES_BLOGS = "/user/:userId/favouritesBlogs";
const GET_URL_IMAGE = "/uploads/images/:imageName";

const POST_URL_SIGNUP = "/signUp";
const POST_URL_LOGIN = "/logIn";
const POST_URL_BLOG_PUBLISH = "/user/:userId/publishBlog";
const POST_URL_LIKE_BLOG = "/likeBlog";
const POST_URL_VIEW_BLOG = "/viewBlog";
const POST_URL_PUBLISH_COMMENT = "/publishComment";
const POST_URL_ADD_BLOG_TO_FAVOURITES =
  "/user/:userId/blog/:blogId/addBlogToFavourites";
const POST_URL_REMOVE_BLOG_FROM_FAVOURITES =
  "/user/:userId/blog/:blogId/removeBlogFromFavourites";

module.exports = {
  PAGE_SIZE_LIMIT,
  GET_URL_TRENDING,
  GET_URL_BLOGS,
  GET_URL_MY_BLOGS,
  GET_URL_USERDATA,
  GET_URL_USER_FAVOURITES_BLOGS,
  GET_URL_IMAGE,
  POST_URL_SIGNUP,
  POST_URL_LOGIN,
  POST_URL_BLOG_PUBLISH,
  POST_URL_LIKE_BLOG,
  POST_URL_VIEW_BLOG,
  POST_URL_PUBLISH_COMMENT,
  POST_URL_ADD_BLOG_TO_FAVOURITES,
  POST_URL_REMOVE_BLOG_FROM_FAVOURITES,
};
