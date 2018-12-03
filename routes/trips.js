const express = require('express');

const Users = require('../models/Users');
const Trips = require('../models/Trips');
const Itineraries = require('../models/Itineraries');
const Activities = require('../models/Activities');

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
	  	if (await Trips.validDateTimeRange(req.body.startDate, req.body.endDate)) {
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
 * @throws {404} - if trip with given id not found
 * @throws {403} - if user is not a member of trip
 * @throws {400} - if date range is invalid
 */
router.put('/:id', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to change trip details.`,
	    }).end();
	} else {
    const trip = await Trips.findOneById(req.params.id);
    if (trip === undefined) {
      res.status(404).json({
        error: `Trip not found.`,
      }).end();
    } else {
      if (await Trips.checkMembership(req.session.name, req.params.id)) {
        if (await Trips.validDateTimeRange(req.body.newStart, req.body.newEnd)) {
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
 *    joinCode: string
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
      if (await Trips.checkMembership(req.session.name, req.params.id)) {
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
      if (await Trips.checkMembership(req.session.name, req.params.id)) {
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

/**
 * Get all activities of a trip
 * @name GET/api/trips/:tripId/activities
 * @param {int} tripId - id of trip
 * @return {Activity[]} - all activities
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 * @throws {404} - if trip with given tripId not found
 */
router.get('/:tripId/activities', async (req, res) => {
  if (await Trips.checkMembership(req.session.name, req.params.tripId)) {
    if (req.session.name !== undefined) {
      const trip = await Trips.findOneById(req.params.tripId);
      if (trip === undefined) {
        res.status(404).json({
          error: `Trip not found.`,
        }).end();
      } else {
        const all_activities = await Activities.getAllTripActivities(req.params.tripId);
        res.status(200).json(all_activities).end();
      }
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
 * Join a trip.
 * @name POST/api/trips/join
 * @param {string} joinCode - join code for trip
 * @return {Membership} - the newly created trip
 * @throws {401} - if user not logged in
 * @throws {404} - if no trip with that join code found
 * @throws {400} - if user is already a member of that trip
 */
router.post('/join', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
      error: `Must be logged in to join trip.`,
    }).end();
  } else {
    const trip = await Trips.findOneByJoinCode(req.body.joinCode);
    if (trip === undefined) {
      res.status(404).json({
        error: `No trip found for this join code.`,
      }).end();
    } else {
      if (await Trips.checkMembership(req.session.name, trip.id)) {
        res.status(400).json({
          error: `You are already a member of this trip.`,
        }).end();
      } else {
        const new_membership = await Trips.addMember(req.session.name, trip.id);
        res.status(200).json(new_membership).end();
      }
    }
  }
});

module.exports = router;
