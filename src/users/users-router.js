const path = require("path");
const express = require("express");
const xss = require("xss");
const UsersService = require("./users-service");

const usersRouter = express.Router();
const jsonParser = express.json();

const serializeUser = (user) => ({
  id: user.id,
  username: xss(user.username),
  email: xss(user.email),
});

usersRouter.route("/").get((req, res, next) => {
  UsersService.getAllUsers(req.app.get("db"))
    .then((users) => {
      res.json(users.map(serializeUser));
    })
    .catch(next);
});

// CREATE THE STUBS FOR THESE ENDPOINTS - SIGN UP AND LOGIN
usersRouter.route("sign-up").post((req, res, next) => {
  Users.Service.createUser(req.app.get("db"))
    .then((user) => {
      res.json(serializeUser(user));
    })
    .catch(next);
});

// FINISH THESE LATER
usersRouter.route("login").post((req, res, next) => {
  Users.Service.userLogin(req.app.get("db"))
    .then((user) => {
      res.json(serializeUser(user));
    })
    .catch(next);
});

module.exports = usersRouter;
