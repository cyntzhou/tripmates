const express = require('express');

const Users = require('../models/Users');
const Trips = require('../models/Trips');
const Itineraries = require('../models/Itineraries');

const router = express.Router();

/**
 * Create an itinerary.
 * @name POST/api/itineraries
 * @param {string} name - itinerary name
 * @param {number} tripId - id of trip to which this itinerary will belong
 * @return {Itinerary} - the created itinerary
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of the trip
 */
router.post('/', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
		  error: `Must be logged in to create itinerary.`,
		}).end();
	} else {
		if (Trips.checkMembership(req.session.name, req.body.tripId)) {
			const itin = await Itineraries.addOne(req.body.name, req.body.tripId);
			res.status(200).json(itin).end();
		} else {
			res.status(403).json({
				error: `Cannot create itinerary for a trip you're not in.`,
			}).end();
		}
	}
});

/**
 * Star an itinerary
 * @name PUT/api/itineraries/:id/star
 * :id is the id of the itinerary to star
 * @return {Itinerary} - the starred itinerary
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 */
router.put('/:id/star', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to star itinerary.`,
	    }).end();
	} else {
		const itinerary = await Itineraries.findOneById(req.params.id);
		if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
			const itin = await Itineraries.starOne(req.params.id);
			res.status(200).json(itin).end();
		} else {
			res.status(403).json({
				error: `Must be member of trip to star itinerary.`,
			}).end();
		}
	}
});

/**
 * Unstar an itinerary
 * @name PUT/api/itineraries/:id/unstar
 * :id is the id of the itinerary to unstar
 * @return {Itinerary} - the unstarred itinerary
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 */
router.put('/:id/unstar', async (req, res) => {
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to unstar itinerary.`,
	    }).end();
	} else {
		const itinerary = await Itineraries.findOneById(req.params.id);
		if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
			const itin = await Itineraries.unstarOne(req.params.id);
			res.status(200).json(itin).end();
		} else {
			res.status(403).json({
				error: `Must be member of trip to unstar itinerary.`,
			}).end();
		}
	}
});

/**
 * Change the name of an itinerary
 * @name PUT/api/itineraries/:id/name
 * :id is the id of the itinerary to rename
 * @param {string} newName - new name to change to
 * @return {Itinerary} - the renamed itinerary
 * @throws {401} - if user not logged in
 * @throws {403} - if user is not a member of trip
 */
router.put('/:id/name', async (req, res) => {
	console.log("/api/itineraries/:id/name called with newName " + req.body.newName);
	if (req.session.name === undefined) {
		res.status(401).json({
	      error: `Must be logged in to rename itinerary.`,
	    }).end();
	} else {
		const itinerary = await Itineraries.findOneById(req.params.id);
		if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
			const itin = await Itineraries.updateNameOne(req.params.id, req.body.newName);
			res.status(200).json(itin).end();
		} else {
			res.status(403).json({
				error: `Must be member of trip to rename itinerary.`,
			}).end();
		}
	}
});

module.exports = router;