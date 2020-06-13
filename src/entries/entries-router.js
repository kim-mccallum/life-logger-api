const path = require("path");
const express = require("express");
const xss = require("xss");
const EntriesService = require("./entries-service");
const auth = require("../middleware/auth");

const entriesRouter = express.Router();
const jsonParser = express.json();

// need help sanitizing!
const serializeEntry = (entry) => ({
  user_id: entry.user_id,
  date: xss(entry.date),
  target_value: xss(entry.target_value),
  journal_id: xss(entry.journal_id),
  habit_value: xss(entry.habit_value),
});

entriesRouter
  .route("/")
  .get((req, res, next) => {
    EntriesService.getAllEntries(req.app.get("db"))
      .then((entries) => {
        res.status(200).json(entries);
      })
      // should this be next or something else?
      .catch(next);
  })
  // handle duplicate potential on the front end
  .post([jsonParser, auth], (req, res, next) => {
    console.log("Look in request body:", req.body);
    const { user_id, journal_id, date, target_value, habit_value } = req.body;

    // validate - all required fields included?
    for (const field of ["user_id", "target_value", "habit_value"]) {
      if (!req.body[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required.` },
        });
      }
    }
    // create new entry object
    const newEntry = {
      user_id,
      journal_id,
      // date,
      target_value,
      habit_value,
    };

    //call create method
    EntriesService.createEntry(req.app.get("db"), newEntry)
      .then((entry) => {
        res
          .status(201)
          .location(`/entries/${entry.user_id}`)
          // add the serialize function here to sanitize post!?
          .json(entry);
      })
      .catch(next);
  });

entriesRouter
  .route(`/:user_id`)
  .all((req, res, next) => {
    EntriesService.getByUserId(req.app.get("db"), req.params.user_id)
      .then((entries) => {
        if (entries.length === 0) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        // // USER IS UNDEFINED HERE???
        // console.log("Here should be the user id", res.user);
        // res.user = user; //Save the user for the next???
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
