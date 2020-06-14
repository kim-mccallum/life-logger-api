const path = require("path");
const express = require("express");
const xss = require("xss");
const JournalSettingsService = require("./journal-settings-service");
// const auth = require("../middleware/auth");
const { requireAuth } = require("../middleware/jwt-auth");

const journalSettingsRouter = express.Router();
const jsonParser = express.json();

// need help sanitizing!
const serializeJournal = (journal) => ({
  user_id: journal.user_id,
  target_value: xss(journal.target_value),
  units: xss(journal.units),
  type: xss(journal.type),
  target_description: xss(journal.target_description),
  habit_name: xss(journal.habit_name),
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
  // Two middlewares
  .post([jsonParser, requireAuth], (req, res, next) => {
    console.log(req.body);
    console.log("found user id: ", req.user.id);
    // use auth to verify the token? THe middleware works like so:
    // first the jsonParser logic runs, then the auth, then it moves on to run endpoint logic
    const {
      user_id,
      target_name,
      units,
      type,
      target_description,
      habit_name,
      habit_description,
    } = req.body;

    // validate - all required fields included?
    for (const field of [
      "user_id",
      "target_name",
      "units",
      "type",
      "habit_name",
    ]) {
      if (!req.body[field]) {
        return res.status(400).send({
          error: { message: `'${field}' is required.` },
        });
      }
    }
    // are fields the correct type? - ADD THIS LATER
    // MAKE SURE TO ADD SOMETHING TO CHECK IF THE USER ALREADY HAS A JOURNAL SET UP. IF THEY DO, UPDATE IT???

    // put values into newSetting object
    const newSetting = {
      user_id,
      target_name,
      units,
      type,
      target_description,
      habit_name,
      habit_description,
    };
    // Before you call createSetting, call getSettingById, if it returns something, send a message back to update

    JournalSettingsService.createSetting(req.app.get("db"), newSetting)
      .then((setting) => {
        res
          .status(201)
          .location(`/journal-settings/${setting.user_id}`)
          // add the serialize function here to sanitize post!?
          .json(setting);
      })
      .catch(next);
  });

//get by user_id parameter
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
        console.log("Here should be the user id", res.user);
        res.user = user; //Save the user for the next???
        next();
      })
      .catch();
  })
  .get((req, res, next) => {
    res.json({
      // include the journal id in the response
      journal_id: res.user.id,
      user_id: res.user.user_id,
      target_name: xss(res.user.target_name), //sanitize
      units: xss(res.user.units), //sanitize
      type: xss(res.user.type), //sanitize
      target_description: xss(res.user.target_description), //sanitize
      habit_name: xss(res.user.habit_name), //sanitize
      habit_description: xss(res.user.habit_description), //sanitize
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
