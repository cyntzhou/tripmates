const express = require('express');

const Activities = require('../models/Activities');
const Trips = require('../models/Trips');

const router = express.Router();

// TODO Janice notes (can delete later)
// Create an activity
// Get an activity TODO only if activity is part of trip user is in
// Get all activities TODO only if trip is user's
// Edit an activity TODO only if activity is part of trip user is in
// Delete an activity TODO only if activity is part of trip user is in

// Upvote an activity TODO only if activity is part of trip user is in
// Downvote an activity TODO only if activity is part of trip user is in

// Create hours?
// Delete hours?

// Create a place?
// Get place?
// Edit a place?
// Delete a place?

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
 */
 router.post('/', async (req, res) => {
   if (req.session.name !== undefined) {
     const activity = await Activities.addActivity(req.body.name, req.body.tripId, req.body.suggestedDuration, req.body.placeId, req.body.category);
     res.status(200).json(activity).end();
   } else {
     res.status(401).json({
       error: `Must be logged in to create activity.`,
     }).end();
   }
 });

 /**
  * Get all activities of a trip
  * @name GET/api/activities/trip/:tripId
  * @param {int} tripId - id of trip
  * @return {Activity[]} - all activities
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip
  */
  router.get('/trip/:tripId', async (req, res) => {
    if (await Trips.checkMembership(req.session.name, req.params.tripId)) {
      if (req.session.name !== undefined) {
        const all_activities = await Activities.getAllTripActivities(req.params.tripId);
        res.status(200).json(all_activities).end();
      } else {
        res.status(401).json({
          error: `Must be logged in to get all activities.`,
        }).end();
      }
    } else {
			res.status(403).json({
				error: `Must be member of trip to get trip activities.`,
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
  */
  router.get('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      if (await Trips.checkMembership(req.session.name, activity.tripId)) {
        res.status(200).json(activity).end();
      } else {
        res.status(403).json({
          error: `Must be member of trip to get trip activities.`,
        }).end();
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
  */
  router.put('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.editActivity(parseInt(req.params.id), req.body.name, req.body.suggestedDuration, req.body.placeId, req.body.category);
      if (await Trips.checkMembership(req.session.name, activity.tripId)) {
        res.status(200).json(activity).end();
      } else {
        res.status(403).json({
          error: `Must be member of trip to get trip activities.`,
        }).end();
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
  * @throws {403} - if user is not a member of trip this activity belongs to
  */
  router.delete('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.deleteActivity(parseInt(req.params.id));
      res.status(200).json(activity).end();
    } else {
      res.status(401).json({
        error: `Must be logged in to delete activity.`,
      }).end();
    }
  });

 /**
 * Upvote an activity.
 * @name POST/api/activities/upvote
 * @param {string} id - id of the activity
 * @param {string} userId - id of the user
 * @return {Vote} - the vote
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip this activity belongs to
 */
 router.post('/upvote', async (req, res) => {
   if (req.session.name !== undefined) {
     let id = req.body.id;
     let userId = req.body.userId;
     let upvoters = await Activities.getUpvoters(id);
     let downvoters = await Activities.getDownvoters(id);
     if (upvoters.includes(id)) {
       res.status(400).json({
         error: `Activity already upvoted.`,
       }).end();
     }
     else if (downvoters.includes(id)) {
       let upvote = await Activities.removeDownvote(id, userId);
       res.status(200).json(upvote).end();
     } else {
       let upvote = await Activities.upvote(id, userId);
       res.status(200).json(upvote).end();
     }
   } else {
     res.status(401).json({
       error: `Must be logged in to upvote activity.`,
     }).end();
   }
 });

/**
  * Downvote an activity.
  * @name POST/api/activities/downvote
  * @param {string} id - id of the activity
  * @param {string} userId - id of the user
  * @return {Vote} - the vote
  * @throws {401} - if user not logged in
  * @throws {403} - if user is not a member of trip this activity belongs to
  */
  router.post('/downvote', async (req, res) => {
   if (req.session.name !== undefined) {
     let id = req.body.id;
     let userId = req.body.userId;
     let upvoters = await Activities.getUpvoters(id);
     let downvoters = await Activities.getDownvoters(id);
     if (downvoters.includes(id)) {
       res.status(400).json({
         error: `Activity already downvoted.`,
       }).end();
     }
     else if (upvoters.includes(id)) {
       let downvote = await Activities.removeUpvote(id, userId);
       res.status(200).json(downvote).end();
     } else {
       let downvote = await Activities.downvote(id, userId);
       res.status(200).json(downvote).end();
     }
   } else {
     res.status(401).json({
       error: `Must be logged in to downvote activity.`,
     }).end();
   }
  });

/**
 * Get all activities by category of a trip
 * @name GET/api/activities/category/:category
 * @param {string} category - category of activities to filter by
 * @param {int} tripId - id of the activity
 * @return {Activity[]} - all activities with category
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 */
router.get('/category/:category', async (req, res) => {
  if (req.session.name !== undefined) {
    let activities = await Activities.filterByCategory(req.body.tripId, req.params.category);
    res.status(200).json(activities).end();
  } else {
    res.status(401).json({
      error: `Must be logged in to get filtered activities.`,
    }).end();
  }
});

module.exports = router;
