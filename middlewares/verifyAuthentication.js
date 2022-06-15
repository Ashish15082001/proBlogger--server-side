const jwt = require("jsonwebtoken");

const verifyAuthentication = function (request, response, next) {
  try {
    const token = request.get("Authorization").split(" ")[1];
    const decodedToken = jwt.verify(token, "ashishsinghsecret");

    console.log(decodedToken);
    request.jwt = decodedToken;

    next();
  } catch (error) {
    response.status(401).json({ message: error.message });
  }
};

module.exports = { verifyAuthentication };
