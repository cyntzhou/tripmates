const express = require('express');

const Users = require('../models/Users');
const Trips = require('../models/Trips');
const Itineraries = require('../models/Itineraries');

const router = express.Router();

/**
 * Create a trip.
 * @name POST/api/trips
 * @param {string} name - trip name
 * @param {date} startDate - start date of trip
 * @param {date} endDate - end date of trip
 * @return {Trip} - the created trip
 * @throws {401} - if user not logged in
 * @throws {400} - if date range is invalid
 */
router.post('/', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to create trip.`,
	    }).end();
	} else {
	  	if (Trips.validDateRange(req.body.startDate, req.body.endDate)) {
	  		const trip = await Trips.addOne(req.body.name, req.session.name, req.body.startDate, req.body.endDate);
		  	res.status(200).json(trip).end();
	  	} else {
	  		res.status(400).json({
				error: `Not a valid date range. Start date cannot be after end date.`,
			}).end();
	  	}
  	}
});

/**
 * Change a trip's details.
 * @name PUT/api/trips/:id
 * :id is the id of the trip to update
 * @param {string} newName - the new name to change to
 * @param {string} newStart - the new start date to change to
 * @param {string} newEnd - the new end date to change to
 * @return {Trip} - the updated trip
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 * @throws {400} - if date range is invalid
 */
router.put('/:id', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to change trip details.`,
	    }).end();
	} else {
		if (Trips.checkMembership(req.session.name, req.params.id)) {
			if (Trips.validDateRange(req.body.newStart, req.body.newEnd)) {
				const trip = await Trips.updateOne(req.params.id, req.body.newName, req.body.newStart, req.body.newEnd);
				res.status(200).json(trip).end();
			} else {
				res.status(400).json({
					error: `Not a valid date range. Start date cannot be after end date.`,
				}).end();
			}
		} else {
			res.status(403).json({
				error: `Must be member of trip to change trip details.`,
			}).end();
		}
	}
});

/**
 * Delete a trip.
 * @name DELETE/api/trips/:id
 * :id is the id of the trip to delete
 * @return {Trip} - the deleted trip
 * @throws {401} - if user not logged in
 * @throws {404} - if trip with given id not found
 * @throws {403} - if user is not the creator of the trip
 */
router.delete('/:id', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
			error: `Must be logged in to delete trip.`,
		}).end();
	} else {
		const trip = await Trips.findOneById(req.params.id);
		if (trip === undefined) {
			res.status(404).json({
				error: `Trip not found.`,
			}).end();
		} else {
			if (req.session.name !== trip.creatorId) {
				res.status(403).json({
					error: `You cannot delete a trip you did not create.`,
				}).end();
			} else {
				const deleted = await Trips.deleteOne(req.params.id);
				res.status(200).json(deleted).end();
			}
		}
	}
});

/**
 * Get a trip's details
 * @name GET/api/trips/:id
 * :id is the id of the trip to get details of
 * @return {Trip} - an object with the trip's details in the following form:
 * {
 *    name: string,
 *    startDate: string,
 *    endDate: string,
 *    members: string[] (array of usernames)
 * }
 * @throws {401} - if user not logged in
 * @throws {404} - if trip with given id not found
 * @throws {403} - if user is not a member of the trip
 */
router.get('/:id', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
      error: `Must be logged in to access trip details.`,
    }).end();
  } else {
    const trip = await Trips.findOneById(req.params.id);
    if (trip === undefined) {
      res.status(404).json({
        error: `Trip not found.`,
      }).end();
    } else {
      if (Trips.checkMembership(req.session.name, req.params.id)) {
        const tripDetails = await Trips.getTripDetails(req.params.id);
        res.status(200).json(tripDetails).end();
      } else {
        res.status(403).json({
          error: `You cannot access details of a trip you are not in.`,
        }).end();
      }
    }
  }
});

/**
 * Get a trip's itineraries
 * @name GET/api/trips/:id/itineraries
 * :id is the id of the trip to get itineraries of
 * @return {Itineraries[]} - array of all itineraries of this trip
 * @throws {401} - if user not logged in
 * @throws {404} - if trip with given id not found
 * @throws {403} - if user is not a member of the trip
 */
router.get('/:id/itineraries', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
      error: `Must be logged in to access trip itineraries.`,
    }).end();
  } else {
    const trip = await Trips.findOneById(req.params.id);
    if (trip === undefined) {
      res.status(404).json({
        error: `Trip not found.`,
      }).end();
    } else {
      if (Trips.checkMembership(req.session.name, req.params.id)) {
        const itineraries = await Itineraries.findAllForTrip(req.params.id);
        res.status(200).json(itineraries).end();
      } else {
        res.status(403).json({
          error: `You cannot access itineraries of a trip you are not in.`,
        }).end();
      }
    }
  }
});


module.exports = router;