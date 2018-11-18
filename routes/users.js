const express = require('express');

const Users = require('../models/Users');

const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;


/**
 * Create a user.
 * @name POST/api/users
 * @param {string} username - name of new user (link will be /:user)
 * @param {string} password - new user's password
 * @return {User} - the created user
 * @throws {400} - if name is already taken
 */
router.post('/', async (req, res) => {
  if (await Users.findOne(req.body.username) !== undefined) {
    res.status(400).json({
      error: `User ${req.body.username} already exists.`,
    }).end();
  } else {
    const user = await Users.addOne(req.body.username, req.body.password);
    res.status(200).json(user).end();
  }
});

/**
 * Set username of active user.
 * @name POST/api/users/signin
 * @throws {400} - if incorrect password for user
 * @throws {404} - if no such user
 */
router.post('/signin', async (req, res) => {
  const user = await Users.findOne(req.body.username);
  if (user !== undefined) {
  const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      req.session.name = user.id;
      res.status(200).json(user).end();
    } else {
      res.status(400).json({
        error: `Incorrect password for user ${req.body.username}.`,
      }).end();
    }
  } else {
    res.status(404).json({
      error: `No such user ${req.body.username}. Please create user before signing in.`,
    }).end();
  }
});

/**
 * List all users.
 * @name GET/api/users
 * @return {User[]} - list of users
 */
router.get('/', async (req, res) => {
  res.status(200).json(await Users.findAll()).end();
});

/**
 * Get the user with the given username.
 * @name GET/api/users/byname/:username
 * :username is the username of the user you want to get
 * @return {User} - user with given username
 * @throws {404} - if user doesn't exist
 */
router.get('/byname/:username', async (req, res) => {
  const user = await Users.findOne(req.params.username);
  if (user !== undefined) {
    res.status(200).json(user).end();
  } else {
    res.status(404).json({
      error: `Please enter a valid username.`,
    }).end();
  }
});

/**
 * Change a user's username.
 * @name PUT/api/users/:id/username
 * :id is the id of the user to update
 * @param {string} username - the new username to change to
 * @return {User} - the updated user
 * @throws {400} - if name is already taken
 * @throws {403} - if user ID does not match current user
 * @throws {401} - if user not logged in
 */
router.put('/:id/username', async (req, res) => {
  if (req.session.name !== undefined) {
    if (await Users.findOne(req.body.username) === undefined) {
      let user = await Users.findOneById(req.session.name);
      if (user.id === parseInt(req.params.id)) {
        user = await Users.updateUsernameOne(req.session.name, req.body.username);
        res.status(200).json(user).end();
      } else {
        res.status(403).json({
          error: `Please enter your own user ID number`,
        }).end();
      }
    } else {
      res.status(400).json({
        error: `Username ${req.body.username} is already taken. Please select a different username.`,
      }).end();
    }
  } else {
    res.status(401).json({
      error: `Must be logged in to change username.`,
    }).end();
  }
});

/**
 * This endpoint doesn't actually modify anything,
 * it sends an error message if the user tries to update username without typing in id
 * @name PUT/api/users/username
 * @throws {404} - because user did not enter an id
 */
router.put('/username', async (req, res) => {
  res.status(404).json({
    error: `Must type in user ID.`,
  }).end();
});

/**
 * Change a user's password.
 * @name PUT/api/users/:id/password
 * :id is the id of the user to update
 * @param {string} password - the new password to change to
 * @return {User} - the updated user
 * @throws {403} - if user ID does not match current user
 * @throws {401} - if user not logged in
 */
router.put('/:id/password', async (req, res) => {
  if (req.session.name !== undefined) {
    let user = await Users.findOneById(req.session.name);
    if (user.id === parseInt(req.params.id)) {
      user = await Users.updatePasswordOne(req.session.name, req.body.password);
      res.status(200).json(user).end();
    } else {
      res.status(403).json({
        error: `Please enter your own user ID number`,
      }).end();
    }
  } else {
    res.status(401).json({
      error: `Must be logged in to change password.`,
    }).end();
  }
});

/**
 * This endpoint doesn't actually modify anything,
 * it sends an error message if the user tries to update password without typing in id
 * @name PUT/api/users/password
 * @throws {404} - because user did not enter an id
 */
router.put('/password', async (req, res) => {
  res.status(404).json({
    error: `Must type in user ID.`,
  }).end();
});

/**
 * Delete a user.
 * @name DELETE/api/users/:id
 * :id is the id of the user to delete
 * @return {User} - the deleted user
 * @throws {403} - if user doesn't enter their own id
 * @throws {401} - if user not logged in
 */
router.delete('/:id', async (req, res) => {
  if (req.session.name !== undefined) {
    if (req.session.name === parseInt(req.params.id)) {
      let user = await Users.deleteOne(req.session.name);
      req.session.name = undefined;
      res.status(200).json(user).end();
    } else {
      res.status(403).json({
        error: `Must enter your own username.`,
      }).end();
    }
  } else {
    res.status(401).json({
      error: `Must be logged in to delete user.`,
    }).end();
  }
});

/**
 * This endpoint doesn't actually delete anything,
 * it sends an error message if the user tries to delete without id
 * @name DELETE/api/users/
 * @throws {404} - because user did not enter an id
 */
router.delete('/', async (req, res) => {
  res.status(404).json({
    error: `Must include id.`,
  }).end();
});

/**
 * Sign out of active user.
 * @name POST/api/users/signout
 * @throws {401} - if user not logged in
 */
router.post('/signout', async (req, res) => {
  if (req.session.name !== undefined) {
    const user = await Users.findOneById(req.session.name);
    req.session.name = undefined;
    res.status(200).json(user).end();
  } else {
    res.status(401).json({
      error: `Must be logged in to sign out.`,
    }).end();
  }
});

/**
 * See whether user is logged in
 * @name GET/api/users/loggedIn
 * @return {boolean} - true if user logged in, false otherwise
 */
router.get('/loggedIn', async (req, res) => {
  if (req.session.name !== undefined) {
    res.status(200).json(true).end();
  } else {
    res.status(200).json(false).end();
  }
});

/**
 * Get current user
 * @name GET/api/users/whoami
 * @return {User} - current user or {number} -1 if user not logged in
 */
router.get('/whoami', async (req, res) => {
  if (req.session.name !== undefined) {
    res.status(200).json(await Users.findOneById(req.session.name)).end();
  } else {
    res.status(200).json(-1).end();
  }
});

/**
 * Get the user with a given id.
 * @name GET/api/users/:id
 * @return {User} - user with the given id
 * @throws {404} - if no user with given id
 */
router.get('/:id', async (req, res) => {
  const user = await Users.findOneById(parseInt(req.params.id));
  if (user !== undefined) {
    res.status(200).json(user).end();
  } else {
    res.status(404).json({
      error: `No user with given id.`,
    }).end();
  }
});

module.exports = router;
