const database = require('../database');

const sanitizer = require('sanitizer');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const Users = require('../models/Users');
const Activities = require('../models/Activities');

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
      // Generate join code for trip
      const codeLength = 6;
      let tempCode = '';
      while (true) {
        tempCode = await Trips.generateRandomCode(codeLength);
        const codeSql = `SELECT * FROM trip WHERE joinCode=?`;
        const codeResponse = await database.query(codeSql, [tempCode]).then(res => res);
        if (codeResponse.length === 0) { // there isn't already a trip with this joinCode
          break;
        }
      }
      const joinCode = tempCode;

      const sanitizedName = sanitizer.sanitize(name);
      const sql = `INSERT INTO trip (name, creatorId, startDate, endDate, joinCode) VALUES (?, ?, ?, ?, ?);`;
      const insertId = await database.query(sql, [sanitizedName, creatorId, startDate, endDate, joinCode]).then(res => res.insertId);

      // Make creator a member of trip
      const sqlMembership = `INSERT INTO tripMembership (userId, tripId) VALUES (?, ?);`;
      const membershipResponse = await database.query(sqlMembership, [creatorId, insertId]).then(res => res);

      const selectSQL = `SELECT * FROM trip WHERE id=?`;
      const response = await database.query(selectSQL, [insertId]).then(res => res);
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
      const sql = `SELECT * FROM trip WHERE id=?;`;
      const response = await database.query(sql, [id]);
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
	    const selectSQL = `SELECT * FROM tripMembership WHERE userId=? and tripId=?;`;
	    const response = await database.query(selectSQL, [userId, tripId]).then(res => res);
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
   * Check whether two times are in order (i.e. start is not after end)
   * This function assumes that start and end are in correct format: HH:MM
   * If start and end are the same time, they're considered to be in order
   * @param {string} start - start time
   * @param {string} end - end time
   * @return {boolean} - whether these times are in order
   */
   static async timesInOrder(start, end) {
    try {
      const startHour = parseInt(start.slice(0,2));
      const startMinute = parseInt(start.slice(3,5));

      const endHour = parseInt(end.slice(0,2));
      const endMinute = parseInt(end.slice(3,5));

      if (startHour > endHour) {
        return false;
      } else if (startHour < endHour) {
        return true;
      } else { // start and end on same hour
        if (startMinute > endMinute) {
          return false;
        } else if (startMinute < endMinute) {
          return true;
        } else { // start and end on same minute, i.e. same times
          return true;
        }
      }
    } catch (error) {
      throw error;
    }
   }

	/**
   * Check whether a certain date range or date/time range is valid (i.e. end is after start)
   * This function assumes that start and end are in correct format: either both YYYY-MM-DD or both YYYY-MM-DD HH:MM
   * Having the start and end be the same date or date/time is valid.
   * @param {string} start - start date or date/time
   * @param {string} end - end date or date/time
   * @return {boolean} - whether this date or date/time range is valid
   */
	static async validDateTimeRange(start, end) {
	 	try {
	    const startYear = parseInt(start.slice(0,4));
	    const startMonth = parseInt(start.slice(5,7));
	    const startDay = parseInt(start.slice(8,10));

	    const endYear = parseInt(end.slice(0,4));
	    const endMonth = parseInt(end.slice(5,7));
	    const endDay = parseInt(end.slice(8,10));

      let startHour = 0;
      let startMinute = 0;
      let endHour = 0;
      let endMinute = 0;

      if (start.length >= 16 && end.length >= 16) {
        startHour = parseInt(start.slice(11,13));
        startMinute = parseInt(start.slice(14,16));

        endHour = parseInt(end.slice(11,13));
        endMinute = parseInt(end.slice(14,16));
      }

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
          console.log(startDay, endDay, startDay > endDay, startDay < endDay);
	    		if (startDay > endDay) {
	    			return false;
	    		} else if (startDay < endDay) {
            return true;
          } else { // start and end on same day
            if (!(start.length >= 16 && end.length >= 16)) { // start and end don't include times
              return true; // Note: this assumes having the same start and end dates is valid
            } else { // start and end do include times
              if (startHour > endHour) {
                return false;
              } else if (startHour < endHour) {
                return true;
              } else { // start and end in same hour
                if (startMinute > endMinute) {
                  return false;
                } else if (startMinute < endMinute) {
                  return true;
                } else { // start and end in same minute
                  return true; // Note: this assumes having the same start and end date/times is valid
                }
              }
            }
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
      const sql = `UPDATE trip SET name=?, startDate=?, endDate=? WHERE id=?;`;
      const updateResponse = await database.query(sql, [sanitizedName, newStart, newEnd, id]);
      const selectSQL = `SELECT * FROM trip WHERE id=?;`;
      const response = await database.query(selectSQL, [id]).then(res => res);
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
  		const sql = `SELECT tripId FROM tripMembership WHERE userId=?;`;
  		const response = await database.query(sql, [userId]).then(res => res);
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
      const tripSql = `DELETE FROM trip WHERE id=?;`;
      const tripResponse = await database.query(tripSql, [id]);

      const membershipSql = `DELETE FROM tripMembership WHERE tripId=?;`;
      const membershipResponse = await database.query(membershipSql, [id]);

      const activitySql = `DELETE FROM activity WHERE tripId=?;`;
      const activityResponse = await database.query(activitySql, [id]);

      const itinerarySql = `DELETE FROM itinerary WHERE tripId=?;`;
      const itineraryResponse = await database.query(itinerarySql, [id]);

      const activities = await Activities.getAllTripActivities(id);
      activities.forEach(function(activity) {
        Activities.deleteActivity(activity.id);
      });
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
   *    joinCode: string,
   *    members: string[] (array of usernames)
   * }
   */
  static async getTripDetails(id) {
    try {
      let tripDetails = new Object();

      const tripSql = `SELECT * FROM trip WHERE id=?;`;
      const tripResponse = await database.query(tripSql, [id]);
      tripDetails.name = tripResponse[0].name;
      tripDetails.startDate = tripResponse[0].startDate;
      tripDetails.endDate = tripResponse[0].endDate;
      tripDetails.joinCode = tripResponse[0].joinCode;

      const memberSql = `SELECT * FROM tripMembership WHERE tripId=?;`;
      const memberResponse = await database.query(memberSql, [id]).then(res => res);
      let members = [];
      for (let i=0; i<memberResponse.length; i++) {
        const memberId = memberResponse[i].userId;
        const user = await Users.findOneById(memberId);
        members.push(user.username);
      }
      tripDetails.members = members;

      return tripDetails;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Generate a random n-digit code
   * @param {number} n - length of code to generate
   * @return {string} - generated code
   */
  static async generateRandomCode(n) {
    try {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop";
      let result = '';
      for (let i=0; i < n; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find the trip with the given join code, if there is one
   * @param {string} joinCode - join code to match to trip
   * @return {Trip | undefined} - found Trip
   */
  static async findOneByJoinCode(joinCode) {
    try {
      const sql = `SELECT * FROM trip WHERE joinCode=?;`;
      const response = await database.query(sql, [joinCode]);
      return response[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Add a member to a trip
   * @param {number} userId - id of user to add to trip
   * @param {number} tripId - id of trip to add member to
   * @return {Membership} - created membership
   */
  static async addMember(userId, tripId) {
    try {
      const sqlMembership = `INSERT INTO tripMembership (userId, tripId) VALUES (?, ?);`;
      const membershipResponse = await database.query(sqlMembership, [userId, tripId]).then(res => res);
      return membershipResponse;
    } catch (error) {
      throw error;
    }
  }

 }

 module.exports = Trips;
