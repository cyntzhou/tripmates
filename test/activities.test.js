const {
  signin,
  signout,
  createUser,
  deleteUser,
  createPlace,
  addHours,
  createActivity,
  deleteActivity,
  upvote,
  downvote
} = require('./services');

const database = require('../database.js');

const user = {
  username: 'pika',
  password: 'chu'
};

const activity = {
  name: 'hiking',
  tripId: 2,
  suggestedDuration: 30,
  placeId: null,
  category: 'nature'
};

const activity1 = {
  name: 'fishing',
  tripId: 3,
  suggestedDuration: 50,
  placeId: 1,
  category: 'nature'
};

const activity2 = {
  name: 'milk tea',
  tripId: 3,
  suggestedDuration: 20,
  placeId: 2,
  category: 'food'
};

const activity3 = {
  name: 'noodle',
  tripId: 3,
  suggestedDuration: 30,
  placeId: 3,
  category: 'food'
};

const activity4 = {
  name: 'salmon',
  tripId: 4,
  suggestedDuration: 30,
  placeId: 4,
  category: 'food'
};

const address = {
  address: 'toronto'
};

const hours = {
  day: 2,
  startTime: '09:20:00',
  duration: 30,
};

describe('Test /api/activities', () => {
  beforeAll(async () => {
    await database.createTables();
  });

  beforeEach(async () => {
    await createUser(user);
    await signin(user);
  });

  afterEach(async() => {
    await signout();
  });

  afterAll(async() => {
    await database.clearTables();
  });

  // tests create activity with null place, delete activity
  test('POST /activities/places should allow creating activity', async () => {
    const createResponse = await createActivity(activity);
    // console.log(createResponse);
    expect(createResponse.statusCode).toBe(200);

    await expect(database.query(`SELECT * FROM activity WHERE name='hiking'`)).resolves.toBeDefined();
    await expect(database.query(`SELECT * FROM activity WHERE name='hiking' AND tripId='2'`)).resolves.toBeDefined();

    let query = await database.query(`SELECT id FROM activity WHERE name='hiking' AND tripId='2'`);
    // console.log(query);
    let id = query[0].id;

    const deleteResponse = await deleteActivity(id);
    expect(deleteResponse.statusCode).toBe(200);
  });

  // test create activity with a place that has address and hours,
  test('POST /places should create a place, POST/places/hours should add hours', async () => {
    const createResponse = await createActivity(activity1);
    expect(createResponse.statusCode).toBe(200);

    const placeResponse = await createPlace(address);
    expect(placeResponse.statusCode).toBe(200);

    console.log(placeResponse._data);

    // await expect(database.query(`SELECT * FROM activity WHERE name='hiking'`)).resolves.toBeDefined();
    // await expect(database.query(`SELECT * FROM activity WHERE name='hiking' AND tripId='2'`)).resolves.toBeDefined();
    //
    // let query = await database.query(`SELECT id FROM activity WHERE name='hiking' AND tripId='2'`);
    // // console.log(query);
    // let id = query[0].id;
    //
    // const deleteResponse = await deleteActivity(id);
    // expect(deleteResponse.statusCode).toBe(200);
  });

  // test get all activities within trip


  // test filtering

});

afterAll(async () => {
  await database.close();
});
