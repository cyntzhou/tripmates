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
 */
 router.post('/', async (req, res) => {
   const place = await Places.addPlace(req.body.name, req.body.address);
   res.status(200).json(place).end();
 });

 /**
  * Get a place.
  * @name GET/api/places/:id
  * @param {int} id - id of place
  * @return {Place} - place
  */
  router.get('/:id', async (req, res) => {
    const place = await Places.getPlace(parseInt(req.params.id));
    res.status(200).json(place).end();
  });

 /**
  * Update a place
  * @name PUT/api/places/:id
  * @param {int} id - id of place
  * @param {string} name - name
  * @param {string} address - address
  * @return {Place} - the place updated
  */
  router.put('/:id', async (req, res) => {
    const place = await Places.editPlace(parseInt(req.params.id), req.body.name, req.body.address);
    res.status(200).json(place).end();
  });

  /**
   * Delete a place
   * @name DELETE/api/places/:id
   * @param {int} id - id of place
   * @return {Place} - the place updated
   */
   router.delete('/:id', async (req, res) => {
     const place = await Places.deletePlace(parseInt(req.params.id));
     res.status(200).json(place).end();
   });

 // open hours

 /**
  * Create hours (1 segment) for a day
  * @name POST/api/places/:placeId/hours
  * @param {int} placeId - id of places
  * @param {int} day - day
  * @param {string} startTime - start time
  * @param {int} duration - duration in minutes
  * @return {Place} - the place created
  */
  router.post('/:placeId/hours', async (req, res) => {
    const hours = await OpenHours.addOpenHours(req.params.placeId, req.body.day, req.body.startTime, req.body.duration);
    res.status(200).json(hours).end();
  });

 /**
  * Delete hours for a day
  * @name DELETE/api/places/:placeId/hours
  * @param {int} id - id of place
  * @return {Place} - the place updated
  */
  router.delete('/:placeId/hours', async (req, res) => {
    const hours = await OpenHours.deleteOpenHoursOnDay(req.params.placeId, req.body.day);
    res.status(200).json(hours).end();
  });

module.exports = router;
