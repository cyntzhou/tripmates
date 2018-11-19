const database = require('../database');

const sanitizer = require('sanitizer');

/**
 * @class Itineraries
 * Stores all Itineraries.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */

class Itineraries {
	/**
   * Add an Itinerary.
   * @param {string} name - itinerary name
   * @param {number} tripId - id of trip to which this itinerary will belong
   * @return {Itinerary} - created itinerary
   */
  static async addOne(name, tripId) {
    try {
      const sanitizedName = sanitizer.sanitize(name);
      const sql = `INSERT INTO itinerary (name, tripId, starred) VALUES ('${sanitizedName}', '${tripId}', 'false');`;
      const insertId = await database.query(sql).then(res => res.insertId);

      const selectSQL = `SELECT * FROM itinerary WHERE id='${insertId}'`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find an Itinerary by id.
   * @param {number} id - id of Itinerary to find
   * @return {Itinerary | undefined} - found Itinerary
   */
  static async findOneById(id) {
    try {
      const sql = `SELECT * FROM itinerary WHERE id='${id}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Star an Itinerary.
   * @param {number} id - id of itinerary to star
   * @return {Itinerary} - starred itinerary
   */
  static async starOne(id) {
  	try {
  		const sql = `UPDATE itinerary SET starred='1' WHERE id='${id}';`;
      const updateResponse = await database.query(sql);
      const selectSQL = `SELECT * FROM itinerary WHERE id='${id}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
  	} catch (error) {
      throw error;
    }
  }

  /**
   * Unstar an Itinerary.
   * @param {number} id - id of itinerary to unstar
   * @return {Itinerary} - unstarred itinerary
   */
  static async unstarOne(id) {
  	try {
  		const sql = `UPDATE itinerary SET starred='0' WHERE id='${id}';`;
      const updateResponse = await database.query(sql);
      const selectSQL = `SELECT * FROM itinerary WHERE id='${id}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
  	} catch (error) {
      throw error;
    }
  }

  /**
   * Change the name of an Itinerary.
   * @param {number} id - id of itinerary to update
   * @param {string} newName - new name to change to
   * @return {Itinerary} - renamed itinerary
   */
  static async updateNameOne(id, newName) {
  	try {
  		const sanitizedName = sanitizer.sanitize(newName);
  		const sql = `UPDATE itinerary SET name='${sanitizedName}' WHERE id='${id}';`;
      const updateResponse = await database.query(sql);
      const selectSQL = `SELECT * FROM itinerary WHERE id='${id}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
  	} catch (error) {
      throw error;
    }
  }

}

module.exports = Itineraries;