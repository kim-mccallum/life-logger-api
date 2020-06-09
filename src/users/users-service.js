const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("users");
  },
  createUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("users")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  // PUT THIS IN THE AUTH READ THE JWT AUTH STUFF BACKWARDS
  userLogin(knex, username) {
    return knex.select("*").from("users").where("username", username);
  },
  // Maybe need these too - version 2 for admins
  getById(knex, id) {
    return knex.from("users").select("*").where("id", id).first();
  },
  deleteUser(knex, id) {
    return knex("users").where({ id }).delete();
  },
  updateUser(knex, id, newUserFields) {
    return knex("users").where({ id }).update(newUserFields);
  },
};

module.exports = UsersService;
