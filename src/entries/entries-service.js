const EntriesService = {
  getAllEntries(knex) {
    return knex.select("*").from("entries");
  },
  getByUserId(knex, userId) {
    // add journal_settings join SOON
    return knex.from("entries").select("*").where("user_id", userId);
  },
};

module.exports = EntriesService;
