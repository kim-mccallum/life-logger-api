require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const { NODE_ENV } = require("./config");

const usersRouter = require("./users/users-router");
const journalSettingsRouter = require("./journal-settings/journal-settings-router");
const entriesRouter = require("./entries/entries-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// another middleware to check auth token?
app.use("/api/users", usersRouter);
app.use("/api/journal-settings", journalSettingsRouter);
app.use("/api/entries", entriesRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
