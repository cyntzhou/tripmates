const request = require('supertest-session');
const axios = require('axios');
// const instance = require('axios');
// const axios = instance.create({baseURL: 'http://localhost:4000'});

const app = require('../app');

const requestApp = request(app);

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
  // const bodyContent = {
  //   username: user.username,
  //   password: user.password
  // };
  // return axios
  //   .post("/api/users/signin", bodyContent)
  //   .then(res => {
  //     console.log(res);
  //     // eventBus.$emit('signin-success', res.data);
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     // this.errors.push(err.response.data.error);
  //   })
  //   .then(() => {
  //     // this.resetForm();
  //     // this.clearMessages();
  //   });
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
  unstarItinerary
};
