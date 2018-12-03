const database = require('../database');
const sanitizer = require('sanitizer');

/**
 * @typedef Places
 * @prop {int} id - id of place
 * @prop {string} name - name of place
 * @prop {string} address - address of place
 */

/**
 * @class Places
 * Stores all places.
 */
class Places {
  /**
   * Add a place.
   * @param {string} name - name of place
   * @param {string} address - address of place
   */
  static async addPlace(name, address) {
    try {
      const sanitizedName = sanitizer.sanitize(name);
      const sanitizedAddress = sanitizer.sanitize(address);
      const sql = `INSERT INTO place (name, address) VALUES (?, ?);`;
      const response = await database.query(sql, [sanitizedName, sanitizedAddress]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a place by id.
   * @param {int} id - id of place
   */
  static async getPlace(id) {
    try {
      const sql = `SELECT * FROM place WHERE id=?;`;
      const response = await database.query(sql, [id]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Edit a place by id.
   * @param {int} id - id of place
   * @param {string} name - name of place
   * @param {string} address - address of place
   */
  static async editPlace(id, name, address) {
    try {
      const sanitizedName = sanitizer.sanitize(name);
      const sanitizedAddress = sanitizer.sanitize(address);
      const sql = `UPDATE place SET name=?, address=? WHERE id=?;`;
      const response = await database.query(sql, [sanitizedName, sanitizedAddress, id]);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a place by id.
   * @param {int} id - id of place
   * @return {Place} - place
   */
  static async deletePlace(id) {
    try {
      const sql = `DELETE * FROM place WHERE id=?;`;
      const response = await database.query(sql, [id]);

      const membershipSql = `DELETE FROM openHours WHERE placeId=?;`;
      const membershipResponse = await database.query(membershipSql, [id]);

      return response;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = Places;
