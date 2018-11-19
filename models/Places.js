const database = require('../database');

/**
 * @typedef Places
 * @prop {int} id - id of place
 * @prop {string} address - address of place
 */

/**
 * @class Places
 * Stores all places.
 */
class Places {
  /**
   * Add a place.
   * @param {string} address - address of place
   */
  static async addPlace(address) {
    try {
      const sql = `INSERT INTO place (address) VALUES ('${address}');`;
      const response = await database.query(sql);
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
      const sql = `SELECT * FROM place WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Edit a place by id.
   * @param {int} id - id of place
   * @param {string} address - address of place
   */
  static async editPlace(id, address) {
    try {
      const sql = `UPDATE place SET address='${address}' WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a place by id.
   * @param {int} id - id of place
   * @return {Activity | undefined} - found Activity
   */
  static async deletePlace(id) {
    try {
      const sql = `DELETE * FROM place WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = Places;
