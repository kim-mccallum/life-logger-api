const path = require("path");
const express = require("express");
const xss = require("xss");
const EntriesService = require("./entries-service");

const entriesRouter = express.Router();
const jsonParser = express.json();

// USE THIS TO SANITIZE REQ/RES
const serializeEntry = (entry) => ({
  user_id: entry.user_id,
  date: xss(entry.date),
  target_value: xss(entry.target_value),
  journal_id: xss(entry.journal_id),
  habit_1: xss(entry.habit_1),
  habit_2: xss(entry.habit_2),
  habit_3: xss(entry.habit_3),
});

entriesRouter.route("/").get((req, res, next) => {
  console.log("Look in request body:", req.body);
  let { user_id } = req.body;
  //   Get entries by user_id
  if (user_id) {
    console.log(user_id);
    EntriesService.getByUserId(req.app.get("db"), user_id)
      .then((entries) => {
        res.status(200).json(entries);
      })
      // should this be next or something else?
      .catch(next);
  }
  EntriesService.getAllEntries(req.app.get("db"))
    .then((entries) => {
      res.status(200).json(entries);
    })
    // should this be next or something else?
    .catch(next);
});

// // Stuff below is not being used/working
//by id? As a parameter or in the body???
entriesRouter
  .route(`/:user_id`)
  .all((req, res, next) => {
    EntriesService.getByUserId(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        // USER IS UNDEFINED HERE
        console.log("Here should be the user id", res.user);
        res.user = user; //Save the user for the next?
        next();
      })
      .catch();
  })
  .get((req, res, next) => {
    EntriesService.getByUserId(req.app.get("db"), req.params.user_id)
      .then((entries) => {
        res.json(entries);
      })
      // should this be next or something else?
      .catch(next);
  });

module.exports = entriesRouter;
