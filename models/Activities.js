const database = require('../database');

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
      let response = await database.query(sql);
      if (response.length === 0) {
        return undefined;
      } else {
        let a = response[0];

        // activity
        let name = a.name;
        let suggestedDuration = a.suggestedDuration;
        let category = null;
        if (a.category) {
          category = a.category;
        }
        let placeId = a.placeId;
        let tripId = a.tripId;

        // place
        const place_query = `SELECT * FROM place WHERE id='${placeId}';`;
        const place_response = await database.query(place_query);
        let address = null;
        let placeName = null;
        if (place_response.length != 0) {
          address = place_response[0].address;
          placeName = place_response[0].name;
        }

        // openHours
        const openhours_query = `SELECT * FROM openHours WHERE placeId='${placeId}'`;
        const openhours_response = await database.query(openhours_query);
        let openHours = openhours_response;

        // votes
        let votes = await Activities.numVotes(id);
        let upvoters = await Activities.getUpvoters(id);
        let downvoters = await Activities.getDownvoters(id);

        return { id, tripId, name, suggestedDuration, category, placeId, placeName, address, openHours, votes, upvoters, downvoters };
      }
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

      // activity
      let id = a.id;
      let name = a.name;
      let suggestedDuration = a.suggestedDuration;
      let category = null;
      if (a.category !== 'null') {
        category = a.category;
      }
      let placeId = a.placeId;
      let tripId = a.tripId;

      // place
      const place_query = `SELECT * FROM place WHERE id='${placeId}';`;
      const place_response = await database.query(place_query);
      let address = null;
      let placeName = null;
      if (place_response.length != 0) {
        address = place_response[0].address;
        placeName = place_response[0].name;
      }

      // openHours
      const openhours_query = `SELECT * FROM openHours WHERE placeId='${placeId}'`;
      const openhours_response = await database.query(openhours_query);
      let openHours = openhours_response;

      // votes
      let votes = await Activities.numVotes(id);
      let upvoters = await Activities.getUpvoters(id);
      let downvoters = await Activities.getDownvoters(id);

      all_activities.push({ id, tripId, name, suggestedDuration, category, placeId, placeName, address, openHours, votes, upvoters, downvoters });
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
      // TODO delete respective votes in table
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
  static async editActivity(id, name=null, suggestedDuration=null, placeId=null, category=null) {
    try {
      const sql = `UPDATE activity SET name='${name}', suggestedDuration='${suggestedDuration}', placeId='${placeId}', category='${category}' WHERE id='${id}';`;
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
      const sqlUp = `SELECT * FROM activityVotes WHERE activityId='${id}' AND value='1';`;
      const responseUp = await database.query(sqlUp);
      const sqlDown = `SELECT * FROM activityVotes WHERE activityId='${id}' AND value='-1';`;
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
      const sql = `SELECT userId FROM activityVotes WHERE activityId='${id}' AND value='1';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        upvoters.push(parseInt(response[i].userId));
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
      const sql = `SELECT userId FROM activityVotes WHERE activityId='${id}' AND value='-1';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        downvoters.push(parseInt(response[i].userId));
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
      const sql = `DELETE FROM activityVotes WHERE activityId='${id}' AND userId='${userId}' AND value='1';`;
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
      const sql = `DELETE FROM activityVotes WHERE activityId='${id}' AND userId='${userId}' AND value='-1';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }


  // ---- Filter -----

  /**
   * Find activities by category.
   * @param {int} tripId - trip id
   * @param {string} category - category of activities to filter by
   * @return {Activity[] | undefined} - array of activities
   */
  static async filterByCategory(tripId, category) {
    let activities = [];
    try {
      const sql = `SELECT * FROM activity WHERE tripId='${tripId}' AND category='${category}';`;
      const response = await database.query(sql);
      for (let i = 0; i < response.length; i++) {
        let a = response[i];

        // activity
        let id = a.id;
        let name = a.name;
        let suggestedDuration = a.suggestedDuration;
        let category = null;
        if (a.category) {
          category = a.category;
        }
        let placeId = a.placeId;
        let tripId = a.tripId;

        // place
        const place_query = `SELECT * FROM place WHERE id='${placeId}';`;
        const place_response = await database.query(place_query);
        let address = null;
        let placeName = null;
        if (place_response.length != 0) {
          address = place_response[0].address;
          placeName = place_response[0].name;
        }

        // openHours
        const openhours_query = `SELECT * FROM openHours WHERE placeId='${placeId}'`;
        const openhours_response = await database.query(openhours_query);
        let openHours = openhours_response;

        // votes
        let votes = await Activities.numVotes(id);
        let upvoters = await Activities.getUpvoters(id);
        let downvoters = await Activities.getDownvoters(id);

        activities.push({ id, tripId, name, suggestedDuration, category, placeId, placeName, address, openHours, votes, upvoters, downvoters });
      }
      // console.log("filtered activities:");
      // console.log(activities);
      return activities;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Activities;
