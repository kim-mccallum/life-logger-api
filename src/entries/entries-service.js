const EntriesService = {
  getAllEntries(knex) {
    // return knex.select("*").from("entries");
    return knex
      .from("entries")
      .innerJoin(
        "journal_settings",
        "entries.journal_id",
        "journal_settings.id"
      )
      .select("*")
      .from("entries");
  },
  getByUserId(knex, userId) {
    // add journal_settings join SOON
    return knex
      .from("entries")
      .innerJoin(
        "journal_settings",
        "entries.journal_id",
        "journal_settings.id"
      )
      .select("*")
      .where("entries.user_id", userId);
  },
};

module.exports = EntriesService;
