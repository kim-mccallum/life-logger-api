const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  username: xss(user.username),
  email: xss(user.email),
});

// JUST HAVE CRUD OPS
usersRouter.route("/").get((req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then((users) => {
      res.json(users.map(serializeUser));
    })
    .catch(next);
});

// CREATE THE STUBS FOR THESE ENDPOINTS - SIGN UP IS JUST POST ON /
usersRouter.route("/sign-up").post((req, res, next) => {
  // NOT DONE!!
  // console.log(req.body);
  let { password, username, email } = req.body;
  bcrypt.hash(password, 12).then((hashedPW) => {
    // console.log(hashedPW);
    const newCred = { username, email, password: hashedPW };
    UsersService.createUser(req.app.get("db"), newCred)
      .then((user) => {
        res.status(201).json(serializeUser(user));
      })
      .catch(next);
  });
});

// FINISH THESE LATER
usersRouter.route("/login").post((req, res, next) => {
  let { username, password } = req.body;
  let pwd = password;
  let loadedUser;
  UsersService.userLogin(req.app.get("db"), username)
    .then((user) => {
      console.log(user);
      let { username, password, id } = user[0];
      console.log(password, pwd);
      loadedUser = { username, id };
      // compare the request pw to db pw - this is a promise
      // compare user to stored - order matters
      return bcrypt.compare(pwd, password);
    })
    .then((isValid) => {
      if (!isValid) {
        throw new Error("password is not valid");
      }
      // build the token
      const token = jwt.sign(
        {
          username: loadedUser.username,
          id: loadedUser.id,
          // eventually move this random string into env variables
        },
        "alskdjflaskdjalskdfjlksjdflskawivnzp"
      );
      res.status(200).json({ token, username, id: loadedUser.id });
    })
    .catch(next);
});

module.exports = usersRouter;
