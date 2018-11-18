const express = require('express');

const Activities = require('../models/Activities');

const router = express.Router();

// Janice notes (can delete later)
// Create an activity
// Get an activity
// Get all activities
// Edit an activity
// Delete an activity

// Upvote an activity
// Downvote an activity
// Filter activities by category

// Create a place
// Edit a place

/**
 * Create an activity.
 * @name POST/api/activities
 * @param {string} name - name of activity
 * @param {int} suggestedDuration - suggested duration of activity
 * @param {string} password - new user's password
 * @param {string} category - category of the activity
 * @throws {400} - if name is already taken
 */
router.post('/', async (req, res) => {

  res.status(200).json(activity).end();
});

module.exports = router;
