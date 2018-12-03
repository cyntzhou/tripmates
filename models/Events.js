const database = require('../database');

const Trips = require('../models/Trips');
const Activities = require('../models/Activities');

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
      const sql = `INSERT INTO event (itineraryId, activityId, startDateTime, endDateTime) VALUES (?, ?, ?, ?);`;
      const insertId = await database.query(sql, [itineraryId, activityId, start, end]).then(res => res.insertId);

      const selectSQL = `SELECT * FROM event WHERE id=?`;
      const response = await database.query(selectSQL, [insertId]).then(res => res);
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
      const sql = `SELECT * FROM event WHERE id=?;`;
      const response = await database.query(sql, [id]);
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
      const sql = `UPDATE event SET startDateTime=?, endDateTime=? WHERE id=?;`;
      const updateResponse = await database.query(sql, [newStart, newEnd, id]);
      const selectSQL = `SELECT * FROM event WHERE id=?;`;
      const response = await database.query(selectSQL, [id]).then(res => res);
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
      const sql = `DELETE FROM event WHERE id=?;`;
      const response = await database.query(sql, [id]);
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
      const selectSQL = `SELECT * FROM event WHERE itineraryId=?;`;
      const response = await database.query(selectSQL, [itineraryId]).then(res => res);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Determine whether an event conflicts with other events in the same itinerary
   * Assumes that start/end is a valid time range (i.e. end is not before start), and that start and end are appropriately formatted date-time strings
   * @param {string} start - date/time this event starts
   * @param {string} end - date/time this event ends
   * @param {number} itineraryId - id of Itinerary for this event
   * @return {boolean} - true if this event conflicts with another event, false if not
   */
  static async conflictsWithOtherEvent(start, end, itineraryId) {
    try {
      const otherEvents = await Events.findAllForItinerary(itineraryId);
      for (let i=0; i < otherEvents.length; i++) {
        const event = otherEvents[i];
        // Check whether one of the events ends before the other starts. If so, then they don't conflict
        if (!(Trips.validDateTimeRange(end, event.startDateTime) || Trips.validDateTimeRange(event.endDateTime, start))) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Determine whether an event takes place during the open hours of its activity's place
   * Assumes that start/end is a valid time range (i.e. end is not before start), and that start and end are appropriately formatted date-time strings
   * @param {string} start - date/time this event starts
   * @param {string} end - date/time this event ends
   * @param {number} activityId - id of Activity for this event
   * @return {boolean} - true if this event's activity doesn't have a place, this event's activity's place doesn't have open hours, 
   * or this event takes place during the open hours of its activity's place. false otherwise (i.e. if the event happens while the place is closed)
   */
  static async duringOpenHours(start, end, activityId) {
    try {
      // find whether this activity has a place
      // find whether this place has open hours
      // get the open hours
      // for each continous block of open hours (careful with this: 24 hour places, past midnight, etc.),
      // find whether this event takes place completely within the block
      // if there is such a block that completely encompasses the event, return true
      // if not, return false

      const activity = await Activities.getActivity(activityId);
      console.log("activity.placeId: " + activity.placeId);
      console.log("activity.openHours: " + activity.openHours);
      console.log(activity.openHours);
      console.log("Length of activity.openHours: " + activity.openHours.length);
      console.log("Start date: " + new Date(start));

      const startDate = new Date(start);
      const startDayOfWeek = startDate.getDay();
      console.log("start day of week: " + startDayOfWeek);

      const endDate = new Date(end);
      const endDayOfWeek = endDate.getDay();

      // if (activity.placeId === 0) { // activity doesn't have place
      //   return true;
      // }
      if (activity.openHours.length === 0) { // activity doesn't have place or place doesn't have hours
        return true;
      }

      for (let i=0; i<activity.openHours.length; i++) {
        const openHour = activity.openHours[i];
        if (openHour.day === startDayOfWeek) {
          if (Trips.timesInOrder(openHour.startTime, start)) {
            // if the event ends before the open hour ends
            //  return true
          }
        }
      }
      // return false





      return true;


      
    } catch (error) {
      throw error;
    }
  }

 }

 module.exports = Events;