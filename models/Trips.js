const database = require('../database');

const sanitizer = require('sanitizer');

const Users = require('../models/Users');

/**
 * @class Trips
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

      // make creator a member of trip
      const sqlMembership = `INSERT INTO tripMembership (userId, tripId) VALUES ('${creatorId}', '${insertId}');`;
      const membershipResponse = await database.query(sqlMembership).then(res => res);

      const selectSQL = `SELECT * FROM trip WHERE id='${insertId}'`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find a Trip by id.
   * @param {number} id - id of Trip to find
   * @return {Trip | undefined} - found Trip
   */
  static async findOneById(id) {
    try {
      const sql = `SELECT * FROM trip WHERE id='${id}';`;
      const response = await database.query(sql);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update a Trip's name.
   * @param {number} userId - id of user
   * @param {number} tripId - id of trip
   * @return {boolean} - whether this user is a member of this trip
   */
	static async checkMembership(userId, tripId) {
	 	try {
	    const selectSQL = `SELECT * FROM tripMembership WHERE userId='${userId}' and tripId='${tripId}';`;
	    const response = await database.query(selectSQL).then(res => res);
	    if (response.length === 0) {
	    	return false;
	    } else {
	    	return true;
	    }
	  } catch (error) {
	    throw error;
	  }
	}

	/**
   * Check whether a certain date range is valid (i.e. end date is after start date)
   * @param {string} startDate - start date
   * @param {string} endDate - end date
   * @return {boolean} - whether this date range is valid
   */
	static async validDateRange(startDate, endDate) {
	 	try {
	    const startYear = parseInt(startDate.slice(0,4));
	    const startMonth = parseInt(startDate.slice(5,7));
	    const startDay = parseInt(startDate.slice(8,10));

	    const endYear = parseInt(endDate.slice(0,4));
	    const endMonth = parseInt(endDate.slice(5,7));
	    const endDay = parseInt(endDate.slice(8,10));

	    if (startYear > endYear) {
	    	return false;
	    } else if (startYear < endYear) {
	    	return true;
	    } else { // start and end in same year
	    	if (startMonth > endMonth) {
	    		return false;
	    	} else if (startMonth < endMonth) {
	    		return true;
	    	} else { // start and end in same month
	    		if (startDay > endDay) {
	    			return false;
	    		} else { // Note: this assumes having the same start and end dates is fine
	    			return true;
	    		}
	    	}
	    }
	  } catch (error) {
	    throw error;
	  }
	}

	/**
   * Update a Trip.
   * @param {number} id - trip id
   * @param {string} newName - new name for trip
   * @param {string} newStart - new start date for trip
   * @param {string} newEnd - new end date for trip
   * @return {Trip} - updated trip
   */
  static async updateOne(id, newName, newStart, newEnd) {
  	try {
      const sanitizedName = sanitizer.sanitize(newName);
      const sql = `UPDATE trip SET name='${sanitizedName}', startDate='${newStart}', endDate='${newEnd}' WHERE id='${id}';`;
      const updateResponse = await database.query(sql);
      const selectSQL = `SELECT * FROM trip WHERE id='${id}';`;
      const response = await database.query(selectSQL).then(res => res);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Given a user, find all trips they are a member of.
   * @param {number} userId - id of user
   * @return {number[]} - IDs of trips of which this user is a member
   */
  static async findMyTrips(userId) {
  	try {
  		const sql = `SELECT tripId FROM tripMembership WHERE userId='${userId}';`;
  		const response = await database.query(sql).then(res => res);
  		return response;
  	} catch (error) {
      throw error;
    }
  }

  /**
   * Delete a Trip, from both the trips table and the membership table
   * @param {number} id - id of Trip to delete
   * @return {Trip | undefined} - deleted Trip
   */
  static async deleteOne(id) {
  	try {
      const tripSql = `DELETE FROM trip WHERE id='${id}';`;
      const tripResponse = await database.query(tripSql);

      const membershipSql = `DELETE FROM tripMembership WHERE tripId='${id}';`;
      const membershipResponse = await database.query(membershipSql);

      return tripResponse[0];
    } catch (err) {
    	throw err;
    }
  }

  /**
   * Given a trip id, find the details of that trip (name, date range, members).
   * @param {number} id - id of trip
   * @return {Object} - Details of trip in format:
   * {
   *    name: string,
   *    startDate: string,
   *    endDate: string,
   *    members: string[] (array of usernames)
   * }
   */
  static async getTripDetails(id) {
    try {
      let tripDetails = new Object();

      const tripSql = `SELECT * FROM trip WHERE id='${id}';`;
      const tripResponse = await database.query(tripSql);
      tripDetails.name = tripResponse[0].name;
      tripDetails.startDate = tripResponse[0].startDate;
      tripDetails.endDate = tripResponse[0].endDate;

      const memberSql = `SELECT * FROM tripMembership WHERE tripId='${id}';`;
      const memberResponse = await database.query(memberSql).then(res => res);
      let members = [];
      for (let i=0; i<memberResponse.length; i++) {
        const memberId = memberResponse[i].userId;
        // get user's username from their id somehow
        const user = await Users.findOneById(memberId);
        members.push(user.username);
      }
      tripDetails.members = members;

      return tripDetails;
    } catch (err) {
      throw err;
    }
  }

 }

 module.exports = Trips;