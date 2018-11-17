const database = require('../database');

// x Create an activity
// x Get an activity
// Edit an activity
// x Delete an activity

// Upvote an activity
// Downvote an activity
// Filter activities by category

// Create a place
// Edit a place

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
  static async findActivity(id) {
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

  const sql = `UPDATE Freets SET content='${content}' WHERE fID='${id}';`;

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
      const sql = `UPDATE activity SET (name, suggestedDuration, placeId, tripId, category) VALUES ('${name}', '${suggestedDuration}', '${placeId}', '${tripId}', '${category}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }





  /**
   * Find Freets by author.
   * @param {string} author - username of the author of the Freet
   * @return {Freet[] | undefined} - array of Freets
   */
  static async findFreets(author) {
    let author_freets = [];
    let freet_responses = [];

    let user_id = await Freets.getIdByUsername(author).then(res => res);

    try {
      const sql = `SELECT * FROM Freets WHERE uID='${user_id}';`;
      const response = await database.query(sql);
      freet_responses = response;
    } catch (error) {
      throw error;
    }
    for (let i = 0; i < freet_responses.length; i++) {
      let freet = freet_responses[i];
      let id = freet.fID;
      let author = await Freets.getUsernameById(freet.uID).then(res => res);
      let content = freet.content;

      let original_author_id = freet.originalAuthorID;
      let original_author = "";
      if (original_author_id) {
        original_author = await Freets.getUsernameById(original_author_id).then(res => res);
      }

      // votes
      let upvotes = await Freets.num_upvotes(freet.fID).then(res => res);
      let downvotes = await Freets.num_downvotes(freet.fID).then(res => res);
      let votes = upvotes - downvotes;
      let is_refreet = freet.isRefreet;
      author_freets.push({ id, author, content, votes, is_refreet, original_author });
    }
    return author_freets;
  }



  /**
   * Delete Freets by author.
   * @param {string} author - username of the author of the Freets
   * @return {Freet[] | undefined} - array of Freets
   */
  static async deleteFreets(author) {
    let user_id = await Freets.getIdByUsername(author).then(res => res);
    try {
      const sql = `DELETE FROM Freets WHERE uID='${user_id}' OR originalAuthorID='${user_id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Return an array of all of the Freets.
   * @return {Freet[]}
   */
  static async findAll() {
    let all_freets = [];
    let freet_responses = [];

    try {
      const sql = `SELECT * FROM Freets;`;
      const response = await database.query(sql);
      freet_responses = response;
    } catch (error) {
      throw error;
    }
    for (let i = 0; i < freet_responses.length; i++) {
      let freet = freet_responses[i];
      let id = freet.fID;
      let author = await Freets.getUsernameById(freet.uID).then(res => res);
      let content = freet.content;
      let original_author_id = freet.originalAuthorID;
      let original_author = "";
      if (original_author_id) {
        original_author = await Freets.getUsernameById(original_author_id).then(res => res);
      }

      // votes
      let upvotes = await Freets.num_upvotes(freet.fID).then(res => res);
      let downvotes = await Freets.num_downvotes(freet.fID).then(res => res);
      let votes = upvotes - downvotes;
      let is_refreet = freet.isRefreet;
      all_freets.push({ id, author, content, votes, is_refreet, original_author });
    }
    return all_freets;
  }

  /**
   * Update a Freet.
   * @param {int} id - name of Freet to update
   * @param {string} content - new Freet content
   * @return {Short | undefined} - updated Short
   */
  static async updateFreet(id, content) {
    try {
      const sql = `UPDATE Freets SET content='${content}' WHERE fID='${id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get number of upvotes a freet has
   * @param {int} id - id of Freet
   * @return {int} - number of upvotes
   */
  static async num_upvotes(id) {
    try {
      const sql = `SELECT * FROM Upvoters WHERE fID='${id}';`;
      const response = await database.query(sql);
      return response.length;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get number of upvotes a freet has
   * @param {int} id - id of Freet
   * @return {int} - number of upvotes
   */
  static async num_downvotes(id) {
    try {
      const sql = `SELECT * FROM Downvoters WHERE fID='${id}';`;
      const response = await database.query(sql);
      return response.length;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upvote a Freet
   * @param {int} id - id of Freet to upvoted
   * @param {string} username - username of upvoting User
   * @return {Freet | undefined} - upvoted Freet
   */
  static async upvote(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);

    try {
      const sql = `INSERT INTO Upvoters (fID, uID) VALUES ('${id}', '${user_id}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from upvoting.
   * @param {int} id - id of Freet
   * @param {string} username - username of User
   * @return {Freet | undefined} - updated Freet
   */
  static async removeUpvote(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);

    try {
      const sql = `DELETE FROM Upvoters WHERE fID='${id}' AND uID='${user_id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Downvote a Freet
   * @param {int} id - id of Freet to downvoted
   * @param {string} username - username of downvoting User
   * @return {Freet | undefined} - downvoted Freet
   */
  static async downvote(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);

    try {
      const sql = `INSERT INTO Downvoters (fID, uID) VALUES ('${id}', '${user_id}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from downvoting.
   * @param {int} id - id of Freet
   * @param {string} username - username
   * @return {Freet | undefined} - updated Freet
   */
  static async removeDownvote(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);

    try {
      const sql = `DELETE FROM Downvoters WHERE fID='${id}' AND uID='${user_id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user id by username of user
   * @param {string} username - username
   * @return {int} - id
   */
  static async getIdByUsername(username) {
    try {
      const sql = `SELECT uID FROM Users WHERE username='${username}';`;
      const response = await database.query(sql);
      return response[0].uID;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get username by id of user
   * @param {int} id - user id
   * @return {string} - username
   */
  static async getUsernameById(id) {
    try {
      const sql = `SELECT username FROM Users WHERE uID='${id}';`;
      const response = await database.query(sql);
      return response[0].username;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if upvoter of a freet.
   * @param {int} id - id of Freet
   * @param {string} username - username
   * @return {boolean} - if user is upvoter or not
   */
  static async isUpvoter(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    try {
      const sql = `SELECT * FROM Upvoters WHERE fID='${id}' AND uID='${user_id}';`;
      const response = await database.query(sql);
      if (response.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if downvoter of a freet.
   * @param {int} id - id of Freet
   * @param {string} username - username
   * @return {boolean} - if user is downvoter or not
   */
  static async isDownvoter(id, username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    try {
      const sql = `SELECT * FROM Downvoters WHERE fID='${id}' AND uID='${user_id}';`;
      const response = await database.query(sql);
      if (response.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove username from all Freets' upvoters and downvoters
   * @param {string} username - username
   * @return {Freet[] | undefined} updated freets
   */
  static async removeVoter(username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    try {
      const sql = `DELETE FROM Downvoters WHERE uID='${user_id}';`;
      const response = await database.query(sql);
    } catch (error) {
      throw error;
    }
    try {
      const sql = `DELETE FROM Upvoters WHERE uID='${user_id}';`;
      const response = await database.query(sql);
    } catch (error) {
      throw error;
    }
  }

  // following / unfollowing Users

  /**
   * Follow a user
   * @param {string} username - username of User to delete
   * @return {User | undefined} - deleted User
   */
  static async followUser(username, follower) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    let follower_id = await Freets.getIdByUsername(follower).then(res => res);
    try {
      const sql = `INSERT INTO Followers (uID, followerID) VALUES ('${user_id}', '${follower_id}');`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Unfollow a user
   * @param {string} username - username of the followed
   * @param {string} follower - username of the follower
   */
  static async unfollowUser(username, follower) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    let follower_id = await Freets.getIdByUsername(follower).then(res => res);
    try {
      const sql = `DELETE FROM Followers WHERE uID='${user_id}' AND followerID='${follower_id}';`;
      const response = await database.query(sql);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if a user is a follower of another user
   * @param {int} id - id of Freet
   * @param {string} username - username
   * @return {boolean} - if user is upvoter or not
   */
  static async isFollower(username, follower) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    let follower_id = await Freets.getIdByUsername(follower).then(res => res);
    try {
      const sql = `SELECT * FROM Followers WHERE uID='${user_id}' AND followerID='${follower_id}';`;
      const response = await database.query(sql);
      if (response.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove from being followed and following
   * @param {string} username - username
   */
  static async removeFollowingRelations(username) {
    let user_id = await Freets.getIdByUsername(username).then(res => res);
    try {
      const sql = `DELETE FROM Followers WHERE uID='${user_id}';`;
      const response = await database.query(sql);
    } catch (error) {
      throw error;
    }
    try {
      const sql = `DELETE FROM Followers WHERE followerID='${user_id}';`;
      const response = await database.query(sql);
    } catch (error) {
      throw error;
    }
  }

}

module.exports = Freets;
