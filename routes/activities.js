const express = require('express');

const Activities = require('../models/Activities');

const router = express.Router();

// Janice notes (can delete later)
// checks: TODO all only possible if logged in

// Create an activity
// Get an activity
// Get all activities
// Edit an activity TODO only if activity is part of trip user is in
// Delete an activity TODO only if activity is part of trip user is in

// Upvote an activity TODO only if activity is part of trip user is in
// Downvote an activity TODO only if activity is part of trip user is in
// Filter activities by category

// Create hours
// Delete hours

// Create a place
// Get place
// Edit a place
// Delete a place

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
  */
  router.get('/trip/:tripId', async (req, res) => {
    if (req.session.name !== undefined) {
      const all_activities = await Activities.getAllTripActivities(req.params.tripId);
      // console.log(all_activities);
      res.status(200).json(all_activities).end();
    } else {
      res.status(401).json({
        error: `Must be logged in to get all activities.`,
      }).end();
    }
  });

 /**
  * Get an activity.
  * @name GET/api/activities/:id
  * @param {int} id - id of activity
  * @return {Activity} - activity
  * @throws {401} - if user not logged in
  */
  router.get('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.getActivity(parseInt(req.params.id));
      res.status(200).json(activity).end();
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
  */
  router.put('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const activity = await Activities.editActivity(parseInt(req.params.id), req.body.name, req.body.suggestedDuration, req.body.placeId, req.body.category);
      res.status(200).json(activity).end();
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
  */
  router.post('/downvote', async (req, res) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 8da7d6884c9ce5b8ad068c1d66d3ab5991c511d8
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
