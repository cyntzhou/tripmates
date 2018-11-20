const database = require('../database');

/**
 * @class Events
 * Stores all Events.
 * Note that all methods are static.
 * Wherever you import this class, you will be accessing the same data.
 */

 class Events {
  /**
   * Add an Event.
   * @param {number} itineraryId - id of itinerary to which this event will belong
   * @param {number} activityId - id of activity which this event will represent
   * @param {string} start - date/time this event starts
   * @param {string} end - date/time this event ends
   * @return {Event} - created event
   */
  static async addOne(itineraryId, activityId, start, end) {
    try {
      const sql = `INSERT INTO event (itineraryId, activityId, startDateTime, endDateTime) VALUES ('${itineraryId}', '${activityId}', '${start}', '${end}');`;
      const insertId = await database.query(sql).then(res => res.insertId);

      const selectSQL = `SELECT * FROM event WHERE id='${insertId}'`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find an Event by id.
   * @param {number} id - id of Event to find
   * @return {Event | undefined} - found Event
   */
  static async findOneById(id) {
    try {
      const sql = `SELECT * FROM event WHERE id='${id}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an Event.
   * @param {number} id - event id
   * @param {string} newStart - new start date/time for event
   * @param {string} newEnd - new end date/time for event
   * @return {Event} - updated event
   */
  static async updateOne(id, newStart, newEnd) {
    try {
      const sql = `UPDATE event SET startDateTime='${newStart}', endDateTime='${newEnd}' WHERE id='${id}';`;
      const updateResponse = await database.query(sql);
      const selectSQL = `SELECT * FROM event WHERE id='${id}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete an Event.
   * @param {number} id - id of Event to delete
   * @return {Event | undefined} - deleted Event
   */
  static async deleteOne(id) {
    try {
      const sql = `DELETE FROM event WHERE id='${id}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * Find all Events for a specific itinerary
   * @param {number} itineraryId - id of Itinerary for which you want to find events
   * @return {Event[]} - Events for this itinerary
   */
  static async findAllForItinerary(itineraryId) {
    try {
      const selectSQL = `SELECT * FROM event WHERE itineraryId='${itineraryId}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response;
    } catch (error) {
      throw error;
    }
  }

 }

 module.exports = Events;