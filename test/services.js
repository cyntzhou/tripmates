const request = require('supertest-session');
const axios = require('axios');
// const instance = require('axios');
// const axios = instance.create({baseURL: 'http://localhost:4000'});

const app = require('../app');

const requestApp = request(app);

// users

/**
 * @param {object} user
 *  {
 *    username: string
 *    password: string
 *  }
 */
async function signin(user) {
  return requestApp
    .post('/api/users/signin')
    .send(user);
}

/**
 * @param {object} user
 *  {
 *    username: string
 *    password: string
 *  }
 */
async function createUser(user) {
  return requestApp
    .post('/api/users')
    .send(user);
}

async function signout() {
  return requestApp
    .post('/api/users/signout');
}

/**
 * @param {string} id
 */
async function deleteUser(id) {
  return requestApp
    .delete('/api/users/' + id);
}

// trips

/**
 * @param {object} trip
 * {
 *    name: string
 *    startDate: string
 *    endDate: string
 * }
 */
async function createTrip(trip) {
  return requestApp
    .post('/api/trips')
    .send(trip);
}

/**
 * @param {number} id - id of trip to update
 * @param {object} newTrip
 * {
 *    newName: string
 *    newStart: string
 *    newEnd: string
 * }
 */
async function updateTrip(id, newTrip) {
  return requestApp
    .put(`/api/trips/${id}`)
    .send(newTrip);
}

/**
 * @param {number} userId - id of user whose trips you want to find
 */
async function findMyTrips(userId) {
  return requestApp
    .get(`/api/users/${userId}/trips`);
}

/**
 * @param {number} id - id of trip to delete
 */
async function deleteTrip(id) {
  return requestApp
    .delete(`/api/trips/${id}`);
}

// itineraries

/**
 * @param {object} itin
 * {
 *    name: string
 *    tripId: number
 * }
 */
async function createItinerary(itin) {
  return requestApp
    .post(`/api/itineraries`)
    .send(itin);
}

/**
 * @param {number} id - id of itinerary to star
 */
async function starItinerary(id) {
  return requestApp
    .put(`/api/itineraries/${id}/star`);
}

/**
 * @param {number} id - id of itinerary to unstar
 */
async function unstarItinerary(id) {
  return requestApp
    .put(`/api/itineraries/${id}/unstar`);
}

// events

/**
 * @param {object} event
 * {
 *    itineraryId: number
 *    activityId: number
 *    start: string
 *    end: string
 * }
 */
async function createEvent(event) {
  return requestApp
    .post(`/api/events`)
    .send(event);
}

/**
 * @param {number} id - id of event to update
 * @param {object} newTimes
 * {
 *    newStart: string
 *    newEnd: string
 * }
 */
async function updateEvent(id, newTimes) {
  return requestApp
    .put(`/api/events/${id}`)
    .send(newTimes);
}

/**
 * @param {number} id - id of event to delete
 */
async function deleteEvent(id) {
  return requestApp
    .delete(`/api/events/${id}`);
}

// activities
/**
 * @param {string} address - address of activity
 */
async function createPlace(address) {
  return requestApp
    .post('/api/places')
    .send(address);
}

/**
 * @param {int} placeId
 * @param {object} hours
 * {
 *    day: int
 *    startTime: string
 *    duration: int
 * }
 */
async function addHours(hours, placeId) {
  return requestApp
    .post(`/api/places/hours/${placeId}`)
    .send(hours);
}

/**
 * @param {object} activity
 * {
 *    name: string
 *    tripId: int
 *    suggestedDuration: int
 *    placeId: int
 *    category: string
 * }
 */
async function createActivity(activity) {
  return requestApp
    .post(`/api/activities`)
    .send(activity);
}

/**
 * @param {string} id
 */
async function deleteActivity(id) {
  return requestApp
    .delete(`/api/activities/${id}`);
}

/**
 * @param {object} voteInfo
 * {
 *    id: int
 *    userId: int
 * }
 */
async function upvote(voteInfo) {
  return requestApp
    .post('/api/activities/upvote')
    .send(voteInfo);
}

/**
 * @param {object} voteInfo
 * {
 *    id: int
 *    userId: int
 * }
 */
async function downvote(voteInfo) {
  return requestApp
    .post('/api/activities/downvote')
    .send(voteInfo);
}

module.exports = {
  signin,
  createUser,
  signout,
  deleteUser,
  createTrip,
  updateTrip,
  findMyTrips,
  deleteTrip,
  createItinerary,
  starItinerary,
  unstarItinerary,
  createEvent,
  updateEvent,
  deleteEvent,
  createPlace,
  addHours,
  createActivity,
  deleteActivity,
  upvote,
  downvote
};
