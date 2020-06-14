const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

const AuthService = {
  getUserWithUserName(db, username) {
    return db("users").where({ username }).first();
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    console.log("here is the secret:", config.JWT_SECRET);
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: "HS256",
    });
  },
  verifyJwt(token) {
    console.log("trying to verify", token, config.JWT_SECRET);
    // the console.log above returns the line below:
    // trying to verify eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNywiaWF0IjoxNTkyMDk5NzE2LCJleHAiOjE1OTIwOTk3MzYsInN1YiI6ImJvb3RzaWUifQ.w9bdPFCjBhCBKlMtEXd5ThrNPALuNaM_q2m0O6UgDuw my-own-special-jwt-secret

    // THIS IS NOT WORKING
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  },
  parseBasicToken(token) {
    return Buffer.from(token, "base64").toString().split(":");
  },
};

module.exports = AuthService;
