const path = require("path");
const express = require("express");
const xss = require("xss");
const JournalSettingsService = require("./journal-settings-service");

const journalSettingsRouter = express.Router();
const jsonParser = express.json();

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

journalSettingsRouter.route("/").get((req, res, next) => {
  JournalSettingsService.getAllSettings(req.app.get("db"))
    .then((settings) => {
      res.json(settings);
    })
    // should this be next or something else?
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
  .delete((req, res, next) => {
    JournalSettingsService.deleteSetting(req.app.get("db"), req.params.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });
//   // THE CODE BELOW IS COPIED FROM NOTEFUL
// .patch(jsonParser, (req, res, next) => {
//     const { name } = req.body;
//     const folderToUpdate = { name }

//     if(!name){
//         return res.status(400).json({
//             error: { message: `Request body must contain the folder name`}
//         })
//     }

//     FoldersService.updateFolder(
//         req.app.get('db'),
//         req.params.folder_id,
//         folderToUpdate
//     )
//         .then(numRowsAffected => {
//             res.status(204).end()
//         })
//         .catch(next)
// })

module.exports = journalSettingsRouter;
