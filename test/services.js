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
 * @param {string} content
 */
async function createFreet(content) {
  return requestApp
    .post('/api/freets')
    .send({ content });
}

/**
 * @param {string} id
 */
async function deleteUser(id) {
  return requestApp
    .delete('/api/users/' + id);
}

module.exports = {
  signin,
  createUser,
  signout,
  createFreet,
  deleteUser
};
