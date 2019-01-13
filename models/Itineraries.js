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
      const sql = `INSERT INTO itinerary (name, tripId, starred) VALUES (?, ?, 'false');`;
      const insertId = await database.query(sql, [sanitizedName, tripId]).then(res => res.insertId);

      const selectSQL = `SELECT * FROM itinerary WHERE id=?`;
      const response = await database.query(selectSQL, [insertId]).then(res => res);
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
      const sql = `SELECT * FROM itinerary WHERE id=?;`;
      const response = await database.query(sql, [id]);
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
  		const sql = `UPDATE itinerary SET starred='1' WHERE id=?;`;
      const updateResponse = await database.query(sql, [id]);
      const selectSQL = `SELECT * FROM itinerary WHERE id=?;`;
      const response = await database.query(selectSQL, [id]).then(res => res);
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
  		const sql = `UPDATE itinerary SET starred='0' WHERE id=?;`;
      const updateResponse = await database.query(sql, [id]);
      const selectSQL = `SELECT * FROM itinerary WHERE id=?;`;
      const response = await database.query(selectSQL, [id]).then(res => res);
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
  		const sql = `UPDATE itinerary SET name=? WHERE id=?;`;
      const updateResponse = await database.query(sql, [sanitizedName, id]);
      const selectSQL = `SELECT * FROM itinerary WHERE id=?;`;
      const response = await database.query(selectSQL, [id]).then(res => res);
      return response[0];
  	} catch (error) {
      throw error;
    }
  }

  /**
   * Delete an Itinerary, from both the itinerary table and the events table
   * @param {number} id - id of Itinerary to delete
   * @return {Itinerary | undefined} - deleted Itinerary
   */
  static async deleteOne(id) {
  	try {
      const itinSql = `DELETE FROM itinerary WHERE id=?;`;
      const itinResponse = await database.query(itinSql, [id]);

      const eventSql = `DELETE FROM event WHERE itineraryId=?;`;
      const eventResponse = await database.query(eventSql, [id]);

      return itinResponse[0];
    } catch (err) {
    	throw err;
    }
  }

  /**
   * Find all Itineraries for a specific trip
   * @param {number} tripId - id of Trip for which you want to find itineraries
   * @return {Itinerary[]} - Itineraries for this trip
   */
  static async findAllForTrip(tripId) {
  	try {
      const selectSQL = `SELECT * FROM itinerary WHERE tripId=?;`;
      const response = await database.query(selectSQL, [tripId]).then(res => res);
      return response;
  	} catch (error) {
      throw error;
    }
  }

}

module.exports = Itineraries;