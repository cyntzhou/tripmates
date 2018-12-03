const database = require('../database');

/**
 * @typedef OpenHours
 * @prop {int} placeId - id of place
 * @prop {int} day - day of week
 * @prop {string} startTime - starting time
 * @prop {int} duration - duration in minutes
 */

/**
 * @class OpenHours
 * Stores all open hours for places.
 */
class OpenHours {
  /**
   * Add open hours for a place.
   * @param {int} placeId - id of place
   * @param {int} day - day of week
   * @param {string} startTime - starting time
   * @param {string} endTime - ending time
   */
  static async addOpenHours(placeId, day, startTime, endTime) {
    try {
      const sql = `INSERT INTO openHours (placeId, day, startTime, endTime) VALUES ('${placeId}', '${day}', '${startTime}', '${endTime}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete open hours for a place on a day (for editing hours)
   * @param {int} placeId - id of place
   * @param {int} day - day of week
   */
  static async deleteOpenHoursOnDay(placeId, day) {
    try {
      const sql = `DELETE FROM openHours WHERE placeId='${placeId}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

}

module.exports = OpenHours;
