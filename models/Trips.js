const database = require('../database');

const sanitizer = require('sanitizer');

/**
 * @class Trip
 * Stores all Trips.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */

 class Trips {
 	/**
   * Add a Trip.
   * @param {string} name - trip name
   * @param {number} creatorId - id of user who created trip
   * @param {date} startDate - start date of trip
   * @param {date} endDate - end date of trip
   * @return {Trip} - created trip
   */
  static async addOne(name, creatorId, startDate, endDate) {
    try {
      const sanitizedName = sanitizer.sanitize(name);
      const sql = `INSERT INTO trip (name, creatorId, startDate, endDate) VALUES ('${sanitizedName}', '${creatorId}', '${startDate}', '${endDate}');`;
      const insertId = await database.query(sql).then(res => res.insertId);

      const selectSQL = `SELECT * FROM trip WHERE id='${insertId}'`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

 }