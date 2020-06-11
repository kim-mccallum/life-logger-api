const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  console.log("were are in auth!");
  //   get auth key from headers in request
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new Error({ message: "no authorization header" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.SECRET_TOKEN);
  } catch {
    throw new Error({ message: "token not verified" });
  }
  if (!decodedToken) {
    throw new Error({ message: "not authenticated" });
  }
  console.log("here is the token", decodedToken);
  req.user_id = decodedToken.id;
  //   moves on to the output
  next();
};
