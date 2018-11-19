const database = require('../database');

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @typedef User
 * @prop {number} id - user's unique ID
 * @prop {string} username - user's unique username
 * @prop {string} password - user's password
 */

/**
 * @class Users
 * Stores all Users.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */
class Users {
  /**
   * Add a User.
   * @param {string} username - user name
   * @param {string} password - user password
   * @return {User} - created user
   */
  static async addOne(username, password) {
    try {
      const response = await bcrypt.hash(password, saltRounds)
        .then(async function(hash) {
          // Store hash in your password DB.
          const sql = `INSERT INTO user (username, password) VALUES ('${username}', '${hash}');`;
          const sqlResponse = await database.query(sql);
          return sqlResponse;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a User by username.
   * @param {string} username - username of User to find
   * @return {User | undefined} - found User
   */
  static async findOne(username) {
    try {
      const sql = `SELECT * FROM user WHERE username='${username}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a User by id.
   * @param {number} id - id of User to find
   * @return {User | undefined} - found User
   */
  static async findOneById(id) {
    try {
      const sql = `SELECT * FROM user WHERE id='${id}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an array of all of the Users.
   * @return {User[]}
   */
  static async findAll() {
    try {
      const sql = `SELECT * FROM user;`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a User's username.
   * @param {number} id - id of User to update
   * @param {string} newName - new username
   * @return {User | undefined} - updated User
   */
  static async updateUsernameOne(id, newName) {
    try {
      const sql = `UPDATE user SET username='${newName}' WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (err) { throw err; }
  }

  /**
   * Update a User's password.
   * @param {number} id - id of User to update
   * @param {string} password - new password
   * @return {User | undefined} - updated User
   */
  static async updatePasswordOne(id, password) {
    try {
      const response = await bcrypt.hash(password, saltRounds)
        .then(async function(hash) {
          // Store hash in your password DB.
          const sql = `UPDATE user SET password='${hash}' WHERE id='${id}';`;
          const sqlResponse = await database.query(sql);
          return sqlResponse;
      });
    } catch (err) { throw err; }
  }

  /**
   * Delete a User
   * @param {number} id - id of User to delete
   * @return {User | undefined} - deleted User
   */
  static async deleteOne(id) {
    try {
      const sql = `DELETE FROM user WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (err) { throw err; }
  }
}

module.exports = Users;
