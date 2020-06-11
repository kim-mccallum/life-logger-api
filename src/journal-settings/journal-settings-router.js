const path = require("path");
const express = require("express");
const xss = require("xss");
const JournalSettingsService = require("./journal-settings-service");
const auth = require("../middleware/auth");

const journalSettingsRouter = express.Router();
const jsonParser = express.json();

// need help sanitizing
const serializeJournal = (journal) => ({
  user_id: journal.user_id,
  target_value: xss(journal.target_value),
  units: xss(journal.units),
  type: xss(journal.type),
  description: xss(journal.description),
  habit_1: xss(journal.habit_1),
  habit_2: xss(journal.habit_2),
  habit_3: xss(journal.habit_3),
});

journalSettingsRouter
  .route("/")

  .get((req, res, next) => {
    JournalSettingsService.getAllSettings(req.app.get("db"))
      .then((settings) => {
        res.json(settings);
      })
      // if there is an error, pass this
      .catch(next);
  })
  // .post(auth, (req, res, next) => {
  // CAN YOU HAVE TWO MIDDLEWARES? WE MIGHT NEED BODYPARSER AND AUTH?
  .post([jsonParser, auth], (req, res, next) => {
    // .post(jsonParser, (req, res, next) => {
    console.log(req.body);
    // use auth to verify the token? THe middleware works like so:
    // first the jsonParser logic runs, then the auth, then it moves on to run endpoint logic
    const {
      user_id,
      target_name,
      units,
      type,
      description,
      habit_1,
      habit_2,
      habit_3,
    } = req.body;

    // validate - all required fields included?
    for (const field of [
      "user_id",
      "target_name",
      "units",
      "type",
      "description",
      "habit_1",
    ]) {
      if (!req.body[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required.` },
        });
      }
    }
    // are fields the correct type? - ADD THIS LATER

    // put values into newSetting object
    const newSetting = {
      user_id,
      target_name,
      units,
      type,
      description,
      habit_1,
      habit_2,
      habit_3,
    };

    JournalSettingsService.createSetting(req.app.get("db"), newSetting)
      .then((setting) => {
        res
          .status(201)
          .location(`/journal-settings/${setting.user_id}`)
          // add the serialize function here to sanitize!?
          .json(setting);
      })
      .catch(next);
  });

//by id
journalSettingsRouter
  .route(`/:user_id`)
  .all((req, res, next) => {
    JournalSettingsService.getByUserId(req.app.get("db"), req.params.user_id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            error: { message: `user doesn't exist` },
          });
        }
        res.user = user; //Save the user for the next?
        next();
      })
      .catch();
  })
  .get((req, res, next) => {
    res.json({
      user_id: res.user.user_id,
      target_name: xss(res.user.target_name), //sanitize
      units: xss(res.user.units), //sanitize
      type: xss(res.user.type), //sanitize
      description: xss(res.user.description), //sanitize
      habit_1: xss(res.user.habit_1), //sanitize
      habit_2: xss(res.user.habit_2), //sanitize
      habit_3: xss(res.user.habit_3), //sanitize
    });
  })
  // develop this later and PATCH too
  .delete((req, res, next) => {
    JournalSettingsService.deleteSetting(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = journalSettingsRouter;
