const express = require('express');

const Users = require('../models/Users');
const Trips = require('../models/Trips');
const Itineraries = require('../models/Itineraries');
const Events = require('../models/Events');
const Activities = require('../models/Activities');

const router = express.Router();

 // TODO: check that the event time range is within the trip time range,
 // check for conflicts with other events in itinerary (next milestone?)
 // check that activity is in trip activities

/**
 * Create an event.
 * @name POST/api/events
 * @param {number} itineraryId - id of itinerary to which this event will belong
 * @param {number} activityId - id of activity which this event will represent
 * @param {string} start - date/time this event starts
 * @param {string} end - date/time this event ends
 * @return {Event} - the created event
 * @throws {401} - if user not logged in
 * @throws {404} - if itinerary with given id not found, or activity with given id not found
 * @throws {403} - if user is not a member of the trip
 * @throws {400} - if date/time range is invalid
 * @throws {400} - if activity and itinerary aren't in the same trip
 */
router.post('/', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
      error: `Must be logged in to create event.`,
    }).end();
  } else {
    const itinerary = await Itineraries.findOneById(req.body.itineraryId);
    if (itinerary === undefined) {
      res.status(404).json({
        error: `Itinerary not found.`,
      }).end();
    } else {
      if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
        const activity = await Activities.getActivity(req.body.activityId);
        if (activity === undefined) {
          res.status(404).json({
            error: `Activity not found.`,
          }).end();
        } else {
          if (Trips.validDateTimeRange(req.body.start, req.body.end)) {
            const event = await Events.addOne(req.body.itineraryId, req.body.activityId, req.body.start, req.body.end);
            res.status(200).json(event).end();
          } else {
            res.status(400).json({
              error: `Invalid date/time range`,
            }).end();
          }
        }
      } else {
        res.status(403).json({
          error: `Cannot create event for a trip you're not in.`,
        }).end();
      }
    }
  }
});

/**
 * Change an event's date/time range.
 * @name PUT/api/events/:id
 * :id is the id of the event to update
 * @param {string} newStart - the new start date/time to change to
 * @param {string} newEnd - the new end date/time to change to
 * @return {Event} - the updated event
 * @throws {401} - if user not logged in
 * @throws {404} - if event with given id not found
 * @throws {403} - if user is not a member of trip
 * @throws {400} - if date/time range is invalid
 */
router.put('/:id', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
        error: `Must be logged in to change event details.`,
      }).end();
  } else {
    const event = await Events.findOneById(req.params.id);
    if (event === undefined) {
      res.status(404).json({
        error: `Event not found.`,
      }).end();
    } else {
      const itinerary = await Itineraries.findOneById(event.itineraryId);
      if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
        if (Trips.validDateTimeRange(req.body.newStart, req.body.newEnd)) {
          const updatedEvent = await Events.updateOne(req.params.id, req.body.newStart, req.body.newEnd);
          res.status(200).json(updatedEvent).end();
        } else {
          res.status(400).json({
            error: `Invalid date/time range`,
          }).end();
        }
      } else {
        res.status(403).json({
          error: `Must be member of trip to change event details.`,
        }).end();
      }
    }
  }
});

/**
 * Delete an event.
 * @name DELETE/api/events/:id
 * :id is the id of the event to delete
 * @return {Event} - the deleted event
 * @throws {401} - if user not logged in
 * @throws {404} - if event with given id not found
 * @throws {403} - if user is not a member of the trip
 */
router.delete('/:id', async (req, res) => {
  if (req.session.name === undefined) {
    res.status(401).json({
      error: `Must be logged in to delete event.`,
    }).end();
  } else {
    const event = await Events.findOneById(req.params.id);
    if (event === undefined) {
      res.status(404).json({
        error: `Event not found.`,
      }).end();
    } else {
      const itinerary = await Itineraries.findOneById(event.itineraryId);
      if (Trips.checkMembership(req.session.name, itinerary.tripId)) {
        const deleted = await Events.deleteOne(req.params.id);
        res.status(200).json(deleted).end();
      } else {
        res.status(403).json({
          error: `You cannot delete an event for a trip you are not in.`,
        }).end();
      }
    }
  }
});

module.exports = router;