const express = require('express');

const Activities = require('../models/Activities');
const Trips = require('../models/Trips');
const Users = require('../models/Users');

const router = express.Router();

/**
 * Create an activity.
 * @name POST/api/activities
 * @param {string} name - name of activity
 * @param {int} tripId - id of trip
 * @param {int} suggestedDuration - suggested duration of activity
 * @param {int} placeId - id of place
 * @param {string} category - category of the activity
 * @return {Activity} - the activity created
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip this activity belongs to
 * @throws {404} - if activity doesn't exist
 */
 router.post('/', async (req, res) => {
   if (req.session.name !== undefined) {
    const trip = await Trips.findOneById(req.body.tripId);
    if (trip === undefined) {
      res.status(404).json({
        error: `Trip not found.`,
      }).end();
    } else {
      if (await Trips.checkMembership(req.session.name, req.body.tripId)) {
        const activity = await Activities.addActivity(req.body.name, req.body.tripId, req.body.suggestedDuration, req.body.placeId, req.body.category);
        res.status(200).json(activity).end();
      } else {
        res.status(403).json({
          error: `Must be member of trip to post activity to trip.`,
        }).end();
      }
    }
   } else {
     res.status(401).json({
       error: `Must be logged in to create activity.`,
     }).end();
   }
 });

 /**
  * Get an activity.
  * @name GET/api/activities/:id
  * @param {int} id - id of activity
  * @return {Activity} - activity
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip this activity belongs to
  * @throws {404} - if activity or trip doesn't exist (invalid ID)
  */
  router.get('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else {
        const trip = await Trips.findOneById(activity.tripId);
        if (trip === undefined) {
          res.status(404).json({
            error: `Trip not found.`,
          }).end();
        } else {
          if (await Trips.checkMembership(req.session.name, activity.tripId)) {
            res.status(200).json(activity).end();
          } else {
            res.status(403).json({
              error: `Must be member of trip to get trip activities.`,
            }).end();
          }
        }
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to get activity.`,
      }).end();
    }
  });

 /**
  * Update an activity
  * @name PUT/api/activities/:id
  * @param {int} id - id of activity
  * @param {string} name - name of activity
  * @param {int} suggestedDuration - suggested duration of activity
  * @param {int} placeId - id of place
  * @param {string} category - category of the activity
  * @return {Activity} - the activity created
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip this activity belongs to
  * @throws {404} - if activity or trip doesn't exist (invalid ID)
*/
  router.put('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else {
        const trip = await Trips.findOneById(activity.tripId);
        if (trip === undefined) {
          res.status(404).json({
            error: `Trip not found.`,
          }).end();
        } else {
          if (await Trips.checkMembership(req.session.name, activity.tripId)) {
            const activity = await Activities.editActivity(parseInt(req.params.id), req.body.name, req.body.suggestedDuration, req.body.placeId, req.body.category);
            res.status(200).json(activity).end();
          } else {
            res.status(403).json({
              error: `Must be member of trip to get trip activities.`,
            }).end();
          }
        }
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to update activity.`,
      }).end();
    }
  });

 /**
  * Delete an activity.
  * @name DELETE/api/activities/:id
  * @param {int} id - id of activity
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip this activity belongs to TODO idk why it didn't work here
  * @throws {404} - if activity doesn't exist (invalid ID)
  */
  router.delete('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else {
        const activity = await Activities.deleteActivity(parseInt(req.params.id));
        res.status(200).json(activity).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to delete activity.`,
      }).end();
    }
  });

  /**
  * Upvote an activity.
  * @name PUT/api/activities/:id/upvote
  * @param {string} id - id of the activity
  * @param {string} userId - id of the user
  * @return {Vote} - the vote
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip this activity belongs to
  * @throws {404} - if activity or trip doesn't exist (invalid ID)
  */
  router.put('/:id/upvote', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else if (!await Trips.findOneById(activity.tripId)) {
        res.status(404).json({
          error: `Trip not found.`,
        }).end();
      } else if (await Trips.checkMembership(req.session.name, activity.tripId)) {
        let id = req.params.id;
        let userId = req.body.userId;
        let upvoters = await Activities.getUpvoters(id);
        let downvoters = await Activities.getDownvoters(id);
        if (upvoters.includes(parseInt(req.body.userId))) {
          res.status(400).json({
            error: `Activity already upvoted.`,
          }).end();
        } else if (downvoters.includes(parseInt(req.body.userId))) {
          let upvote = await Activities.removeDownvote(id, userId);
          let upvote2 = await Activities.upvote(id, userId);
          res.status(200).json(upvote2).end();
        } else {
          let upvote = await Activities.upvote(id, userId);
          res.status(200).json(upvote).end();
        }
      } else {
        res.status(403).json({
          error: `Must be member of activity's trip to upvote activity.`,
        }).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to upvote activity.`,
      }).end();
    }
  });

 /**
   * Downvote an activity.
   * @name PUT/api/activities/:id/downvote
   * @param {string} id - id of the activity
   * @param {string} userId - id of the user
   * @return {Vote} - the vote
   * @throws {401} - if user not logged in
   * @throws {403} - if user is not a member of trip this activity belongs to
   * @throws {404} - if activity or trip doesn't exist (invalid ID)
 */
   router.put('/:id/downvote', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else if (!await Trips.findOneById(activity.tripId)) {
        res.status(404).json({
          error: `Trip not found.`,
        }).end();
      } else if (await Trips.checkMembership(req.session.name, activity.tripId)) {
        let id = req.params.id;
        let userId = req.body.userId;
        let upvoters = await Activities.getUpvoters(id);
        let downvoters = await Activities.getDownvoters(id);
        if (downvoters.includes(parseInt(req.body.userId))) {
          res.status(400).json({
            error: `Activity already downvoted.`,
          }).end();
        }
        else if (upvoters.includes(parseInt(req.body.userId))) {
          let downvote = await Activities.removeUpvote(id, userId);
          let downvote2 = await Activities.downvote(id, userId);
          res.status(200).json(downvote2).end();
        } else {
          let downvote = await Activities.downvote(id, userId);
          res.status(200).json(downvote).end();
        }
      } else {
        res.status(403).json({
          error: `Must be member of activity's trip to get downvote activity.`,
        }).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to downvote activity.`,
      }).end();
    }
   });

   /**
   * Remove votes for an activity.
   * @name DELETE/api/activities/:id/votes
   * @param {string} id - id of the activity
   * @param {string} userId - id of the user
   * @return {Vote} - the vote
   * @throws {401} - if user not logged in
   * @throws {403} - if user is not a member of trip this activity belongs to
   * @throws {404} - if activity or trip doesn't exist (invalid ID)
   */
   router.delete('/:id/votes', async (req, res) => {
     if (req.session.name !== undefined) {
       const activity = await Activities.getActivity(parseInt(req.params.id));
       if (activity === undefined) {
         res.status(404).json({
           error: `Activity not found.`,
         }).end();
       } else if (!await Trips.findOneById(activity.tripId)) {
         res.status(404).json({
           error: `Trip not found.`,
         }).end();
       } else if (await Trips.checkMembership(req.session.name, activity.tripId)) {
         let id = req.params.id;
         let userId = req.body.userId;
         let resetVotes = await Activities.resetVotes(id, userId);
         console.log("WUUTTT");
         res.status(200).json(resetVotes).end();
       } else {
         res.status(403).json({
           error: `Must be member of activity's trip to reset votes for activity.`,
         }).end();
       }
     } else {
       res.status(401).json({
         error: `Must be logged in to reset votes.`,
       }).end();
     }
   });

 /**
   * Check if current user is downvoter of activity.
   * @name GET/api/activities/:id/downvote
   * @param {string} id - id of the activity
   * @return {Boolean} - whether current user is downvoter or not
   * @throws {401} - if user not logged in
   * @throws {403} - if user is not a member of trip this activity belongs to
   * @throws {404} - if activity or trip or user doesn't exist (invalid ID / username)
 */
   router.get('/:id/downvote', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (req.session.name === undefined) {
        res.status(404).json({
          error: `No user found.`,
        }).end();
      } else if (activity === undefined) {
        res.status(404).json({
          error: `Activity not found.`,
        }).end();
      } else if (!await Trips.findOneById(activity.tripId)) {
        res.status(404).json({
          error: `Trip not found.`,
        }).end();
      } else if (await Trips.checkMembership(req.session.name, activity.tripId)) {
        let id = req.params.id;
        let userId = req.session.name;
        console.log(userId);
        let downvoters = await Activities.getDownvoters(id);
        let isDownvoter = downvoters.includes(userId)
        res.status(200).json(isDownvoter).end();
      } else {
        res.status(403).json({
          error: `Must be member of activity's trip to get downvote activity.`,
        }).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to downvote activity.`,
      }).end();
    }
   });

/**
 * Check if current user is upvoter of activity.
 * @name GET/api/activities/:id/upvote
 * @param {string} id - id of the activity
 * @return {Boolean} - whether current user is downvoter or not
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip this activity belongs to
 * @throws {404} - if activity or trip or user doesn't exist (invalid ID / username)
*/
 router.get('/:id/upvote', async (req, res) => {
  if (req.session.name !== undefined) {
    const activity = await Activities.getActivity(parseInt(req.params.id));
    if (req.session.name === undefined) {
      res.status(404).json({
        error: `No user found.`,
      }).end();
    } else if (activity === undefined) {
      res.status(404).json({
        error: `Activity not found.`,
      }).end();
    } else if (!await Trips.findOneById(activity.tripId)) {
      res.status(404).json({
        error: `Trip not found.`,
      }).end();
    } else if (await Trips.checkMembership(req.session.name, activity.tripId)) {
      let id = req.params.id;
      let userId = req.session.name;
      let upvoters = await Activities.getUpvoters(id);
      let isUpvoter = upvoters.includes(userId)
      res.status(200).json(isUpvoter).end();
    } else {
      res.status(403).json({
        error: `Must be member of activity's trip to get upvote activity.`,
      }).end();
    }
  } else {
    res.status(401).json({
      error: `Must be logged in to upvote activity.`,
    }).end();
  }
 });

 /**
  * Get all activities by category of a trip
  * @name GET/api/activities?category=:categoryType
  * @param {string} categoryType - category of activities to filter by
  * @param {int} tripId - id of the activity
  * @return {Activity[]} - all activities with category
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip
  * @throws {404} - trip not found
  */
 router.get('/', async (req, res) => {
   const trip = await Trips.findOneById(req.body.tripId);
   if (trip === undefined) {
     res.status(404).json({
       error: `Trip not found.`,
     }).end();
   } else if (await Trips.checkMembership(req.session.name, req.body.tripId)) {
     if (req.session.name !== undefined) {
       let activities = await Activities.filterByCategory(req.body.tripId, req.query.category);
       res.status(200).json(activities).end();
     } else {
       res.status(401).json({
         error: `Must be logged in to get filtered activities.`,
       }).end();
     }
   } else {
     res.status(403).json({
       error: `Must be member of this trip.`,
     }).end();
   }
 });

module.exports = router;
