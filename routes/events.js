const express = require('express');

const Users = require('../models/Users');
const Trips = require('../models/Trips');
const Itineraries = require('../models/Itineraries');
const Events = require('../models/Events');
const Activities = require('../models/Activities');

const router = express.Router();

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
 * @throws {400} - if date/time range is invalid, or if activity and itinerary aren't in the same trip, or if event conflicts with other event in itinerary,
 *                or if place closed
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
      if (await Trips.checkMembership(req.session.name, itinerary.tripId)) {
        const activity = await Activities.getActivity(req.body.activityId);
        if (activity === undefined) {
          res.status(404).json({
            error: `Activity not found.`,
          }).end();
        } else {
          if (itinerary.tripId !== activity.tripId) {
            res.status(400).json({
              error: `Activity not in this trip.`,
            }).end();
          } else {
            if (await Trips.validDateTimeRange(req.body.start, req.body.end)) {
              const trip = await Trips.findOneById(itinerary.tripId);
              if (await Trips.validDateTimeRange(trip.startDate, req.body.start.substring(0, 10)) && await Trips.validDateTimeRange(req.body.end.substring(0,10), trip.endDate)) {
                if (await Events.duringOpenHours(req.body.start, req.body.end, req.body.activityId)) {
                  const event = await Events.addOne(req.body.itineraryId, req.body.activityId, req.body.start, req.body.end);
                  res.status(200).json(event).end();
                } else {
                  res.status(400).json({
                    error: `Place closed during this time.`,
                  }).end();
                }


              } else {
                res.status(400).json({
                  error: `Event must happen during trip.`
                }).end();
              }
            } else {
              res.status(400).json({
                error: `Event's start must be before its end.'`,
              }).end();
            }
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
 * @throws {400} - if date/time range is invalid, or if event conflicts with other event in itinerary, or if place closed
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
      if (itinerary === undefined) {
        res.status(404).json({
          error: `Itinerary not found.`,
        }).end();
      } else if (await Trips.checkMembership(req.session.name, itinerary.tripId)) {
        if (await Trips.validDateTimeRange(req.body.newStart, req.body.newEnd)) {
          const trip = await Trips.findOneById(itinerary.tripId);
          if (await Trips.validDateTimeRange(trip.startDate, req.body.newStart.substring(0, 10)) && await Trips.validDateTimeRange(req.body.newEnd.substring(0,10), trip.endDate)) {
            
            if (await Events.duringOpenHours(req.body.start, req.body.end, event.activityId)) {
              const updatedEvent = await Events.updateOne(req.params.id, req.body.newStart, req.body.newEnd);
              res.status(200).json(updatedEvent).end();
            } else {
              res.status(400).json({
                error: `Place closed during this time.`,
              }).end();
            }

          } else {
            res.status(400).json({
              error: `Event must happen during trip.`
            }).end();
          }
        } else {
          res.status(400).json({
            error: `Event's start must be before its end.`,
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
      if (itinerary === undefined) {
        res.status(404).json({
          error: `Itinerary not found.`,
        }).end();
      } else if (await Trips.checkMembership(req.session.name, itinerary.tripId)) {
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

/**
 * Test endpoint, to make sure Events.duringOpenHours works
 * TODO: delete this endpoint
 * @name GET/api/events/test
 * @param {number} activityId - id of activity
 * @param {string} start - start date-time of event
 * @param {string} end - end date-time of event
 * @return {boolean} - whether or not the event takes place during its place's open hours
 */
router.get('/test', async (req, res) => {
  const duringOpenHours = await Events.duringOpenHours(req.body.start, req.body.end, req.body.activityId);
  if (duringOpenHours) {
    res.status(200).json(duringOpenHours).end();
  } else {
    res.status(400).json({
      error: `Place closed.`,
    }).end();
  }
  
});

module.exports = router;
