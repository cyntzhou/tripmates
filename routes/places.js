const express = require('express');

const Places = require('../models/Places');
const OpenHours = require('../models/OpenHours');

const router = express.Router();

// places

/**
 * Create a place.
 * @name POST/api/places
 * @param {string} name - name
 * @param {string} address - address
 * @return {Place} - the place created
 * @throws {401} - if user not logged in
 */
 router.post('/', async (req, res) => {
   if (req.session.name !== undefined) {
     const place = await Places.addPlace(req.body.name, req.body.address);
     res.status(200).json(place).end();
   } else {
     res.status(401).json({
       error: `Must be logged in to create place.`,
     }).end();
   }
 });

 /**
  * Get a place.
  * @name GET/api/places/:id
  * @param {int} id - id of place
  * @return {Place} - place
  * @throws {401} - if user not logged in
  * @throws {404} - if place doesn't exist (invalid ID)
  */
  router.get('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const place = await Places.getPlace(parseInt(req.params.id));
      if (place.length === 0) {
        res.status(404).json({
          error: `Place not found.`,
        }).end();
      } else {
        res.status(200).json(place[0]).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to get place.`,
      }).end();
    }
  });

 /**
  * Update a place
  * @name PUT/api/places/:id
  * @param {int} id - id of place
  * @param {string} name - name
  * @param {string} address - address
  * @return {Place} - the place updated
  * @throws {401} - if user not logged in
  * @throws {404} - if place doesn't exist (invalid ID)
  */
  router.put('/:id', async (req, res) => {
    if (req.session.name !== undefined) {
      const place = await Places.getPlace(parseInt(req.params.id));
      if (place.length === 0) {
        res.status(404).json({
          error: `Place not found.`,
        }).end();
      } else {
        const editedPlace = await Places.editPlace(parseInt(req.params.id), req.body.name, req.body.address);
        res.status(200).json(editedPlace).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to update place.`,
      }).end();
    }
  });

  /**
   * Delete a place
   * @name DELETE/api/places/:id
   * @param {int} id - id of place
   * @return {Place} - the place updated
   * @throws {401} - if user not logged in
   * @throws {404} - if place doesn't exist (invalid ID)
   */
   router.delete('/:id', async (req, res) => {
     if (req.session.name !== undefined) {
       const place = await Places.getPlace(parseInt(req.params.id));
       if (place.length === 0) {
         res.status(404).json({
           error: `Place not found.`,
         }).end();
       } else {
         const deletePlace = await Places.deletePlace(parseInt(req.params.id));
         res.status(200).json(deletePlace).end();
       }
     } else {
       res.status(401).json({
         error: `Must be logged in to delete place.`,
       }).end();
     }
   });

 // open hours

 /**
  * Create hours (1 segment) for a day
  * @name POST/api/places/:placeId/hours
  * @param {int} placeId - id of places
  * @param {int} day - day
  * @param {string} startTime - start time
  * @param {string} endTime - end time
  * @return {Place} - the place created
  * @throws {401} - if user not logged in
  * @throws {404} - if place doesn't exist (invalid ID)
  */
  router.post('/:placeId/hours', async (req, res) => {
    if (req.session.name !== undefined) {
      const place = await Places.getPlace(parseInt(req.params.placeId));
      if (place.length === 0) {
        res.status(404).json({
          error: `Place not found.`,
        }).end();
      } else {
        const hours = await OpenHours.addOpenHours(req.params.placeId, req.body.day, req.body.startTime, req.body.endTime);
        res.status(200).json(hours).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to create open hours.`,
      }).end();
    }
  });

 /**
  * Delete hours for a day
  * @name DELETE/api/places/:placeId/hours
  * @param {int} id - id of place
  * @return {Place} - the place updated
  * @throws {401} - if user not logged in
  * @throws {404} - if place doesn't exist (invalid ID)
  */
  router.delete('/:placeId/hours', async (req, res) => {
    if (req.session.name !== undefined) {
      const place = await Places.getPlace(parseInt(req.params.placeId));
      if (place.length === 0) {
        res.status(404).json({
          error: `Place not found.`,
        }).end();
      } else {
        const hours = await OpenHours.deleteOpenHoursOnDay(req.params.placeId, req.body.day);
        res.status(200).json(hours).end();
      }
    } else {
      res.status(401).json({
        error: `Must be logged in to delete open hours.`,
      }).end();
    }
  });

module.exports = router;
