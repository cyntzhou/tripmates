const database = require('../database');

// Janice notes (can delete later)
// x Create an activity
// x Get an activity
// x Get all activities
// x Edit an activity
// x Delete an activity

// x Upvote an activity
// x Downvote an activity
// x Filter activities by category

/**
 * @typedef Activity
 * @prop {int} id - id of activity
 * @prop {string} name - name of activity
 * @prop {int} suggestedDuration - suggested duration of activity
 * @prop {int} placeId - id of place
 * @prop {int} tripId - id of trip
 * @prop {string} category - category of the activity
 */

/**
 * @class Activities
 * Stores all activities.
 */
class Activities {
  /**
   * Add an activity.
   * @param {string} name - name of activity
   * @param {int} suggestedDuration - suggested duration of activity
   * @param {int} placeId - id of place
   * @param {string} category - category of the activity
   */
  static async addActivity(name, tripId, suggestedDuration=null, placeId=null, category=null) {
    let tripID = await Trips.getCurrentTripId().then(res => res);
    try {
      const sql = `INSERT INTO activity (name, suggestedDuration, placeId, tripId, category) VALUES ('${name}', '${suggestedDuration}', '${placeId}', '${tripId}', '${category}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find an activity by id.
   * @param {int} id - id of activity
   * @return {Activity | undefined} - found Activity
   */
  static async getActivity(id) {
    try {
      const sql = `SELECT * FROM activity WHERE id='${id}';`;
      const response = await database.query(sql);
      if (response.length === 0) {
        return undefined;
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an array of all of the activites.
   * @return {Activity[]}
   */
  static async getAllTripActivities(tripId) {
    let all_activities = [];
    let activity_responses = [];

    try {
      const sql = `SELECT * FROM activity WHERE tripId='${tripId}';`;
      const response = await database.query(sql);
      activity_responses = response;
    } catch (error) {
      throw error;
    }
    for (let i = 0; i < activity_responses.length; i++) {
      let a = activity_responses[i];
      let id = a.id;
      let name = a.name;
      let suggestedDir = a.suggestedDir;
      let category = a.category;
      // TODO places info?
      // TODO votes info?
      }
      all_activities.push({ id, name, suggestedDir, category });
    }
    return all_activities;
  }

  /**
   * Delete activity by id.
   * @param {int} id - id of activity
   */
  static async deleteActivity(id) {
    try {
      const sql = `DELETE FROM activity WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an activity.
   * @param {int} id - id of activity to edit
   * @param {string} name - name of activity
   * @param {int} suggestedDuration - suggested duration of activity
   * @param {int} placeId - id of place
   * @param {string} category - category of the activity
   */
  static async editActivity(id, name=null, tripId=null, suggestedDuration=null, placeId=null, category=null) {
    let tripID = await Trips.getCurrentTripId().then(res => res);
    try {
      const sql = `UPDATE activity SET name='${name}', suggestedDuration='${suggestedDuration}', placeId='${placeId}', tripId='${tripId}', category='${category}' WHERE id='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }


// ---- Votes -----

  /**
   * Get calculated number of votes an activity has
   * @param {int} id - id of activity
   * @return {int} - number of votes
   */
  static async numVotes(id) {
    try {
      const sqlUp = `SELECT * FROM activityVotes WHERE id='${id}' AND value='1';`;
      const responseUp = await database.query(sqlUp);
      const sqlDown = `SELECT * FROM activityVotes WHERE id='${id}' AND value='-1';`;
      const responseDown = await database.query(sqlDown);
      return responseUp.length - responseDown.length;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upvote an activity
   * @param {int} aId - id of activity to upvoted
   * @param {string} userId - username of upvoting User
   */
  static async upvote(activityId, userId) {
    try {
      const sql = `INSERT INTO activityVotes (activityId, userId, value) VALUES ('${activityId}', '${userId}', '-1');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Downvote an activity
   * @param {int} aId - id of activity to upvoted
   * @param {string} userId - username of upvoting User
   */
  static async upvote(activityId, userId) {
    try {
      const sql = `INSERT INTO activityVotes (activityId, userId, value) VALUES ('${activityId}', '${userId}', '1');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get upvoters of activity
   * @param {int} id - id of activity
   * @return {String[]} - upvoter ids
   */
  static async getUpvoters(id) {
    let upvoters = [];
    try {
      const sql = `SELECT userId FROM activityVotes WHERE id='${id}' AND value='1';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        upvoters.push(response[i]);
      }
      return upvoters;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get downvoters of activity
   * @param {int} id - id of activity
   * @return {String[]} - downvoter ids
   */
  static async getDownvoters(id) {
    let downvoters = [];
    try {
      const sql = `SELECT userId FROM activityVotes WHERE id='${id}' AND value='-1';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        downvoters.push(response[i]);
      }
      return downvoters;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from upvoting
   * @param {int} id - id of activity
   * @param {int} userId - user ID
   */
  static async removeUpvote(id, userId) {
    try {
      const sql = `DELETE FROM activityVotes WHERE id='${id}' AND userId='${userId}' AND value='1';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from downvoting
   * @param {int} id - id of activity
   * @param {int} userId - user ID
   */
  static async removeUpvote(id, userId) {
    try {
      const sql = `DELETE FROM activityVotes WHERE id='${id}' AND userId='${userId}' AND value='-1';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }


  // ---- Filter -----

  /**
   * Find activities by category.
   * @param {int} id - id of activity
   * @param {int} tripId - trip id
   * @return {Activity[] | undefined} - array of activities
   */
  static async filterByCategory(id, tripId, category) {
    let activities = [];

    try {
      const sql = `SELECT * FROM activity WHERE id='${id}' AND tripId='${tripId}' AND category='${category}';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        let a = response[i];
        let name = a.name;
        let suggestedDir = a.suggestedDir;
        let category = a.category;
        // TODO places info
        // TODO votes info
        activities.push({ name, suggestedDir, category });
      }
      return activities;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Activities;
