const express = require('express');

const Users = require('../models/Trips');

const router = express.Router();

/**
 * Create a trip.
 * @name POST/api/trips
 * @param {string} name - trip name
 * @param {date} startDate - start date of trip
 * @param {date} endDate - end date of trip
 * @return {User} - the created user
 * @throws {401} - if user not logged in
 */
router.post('/', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
      error: `Must be logged in to create trip.`,
    }).end();
  } else {
  	const trip = await Trips.addOne(req.body.name, req.session.name, req.body.startDate, req.body.endDate);
  	res.status(200).json(trip).end();
  }
});

module.exports = router;