const {
  signin,
  signout,
  createUser,
  deleteUser,
  createPlace,
  addHours,
  createActivity,
  deleteActivity,
  getAllActivities,
  filterActivities,
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
    expect(createResponse.statusCode).toBe(200);

    const foundActivitiesH = await database.query(`SELECT * FROM activity WHERE name='hiking'`);
    // console.log("THE NUMBER OF ACTIVITIES WITH NAME HIKING IS:");
    // console.log(foundActivitiesH.length);

    const foundActivitiesB = await database.query(`SELECT * FROM activity WHERE name='boating'`);
    // console.log("THE NUMBER OF ACTIVITIES WITH NAME BOATING IS:");
    // console.log(foundActivitiesB.length);

    const createdActivity = foundActivitiesH[0];
    expect(createdActivity.id).toBe(createResponse.body.insertId);
    expect(createdActivity.name).toBe(activity.name);
    expect(createdActivity.suggestedDuration).toBe(activity.suggestedDuration);
    expect(createdActivity.placeId).toBe(0);
    expect(createdActivity.tripId).toBe(activity.tripId);
    expect(createdActivity.category).toBe(activity.category);

    let query = await database.query(`SELECT id FROM activity WHERE name='hiking' AND tripId='2'`);
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

    const foundPlace = await database.query(`SELECT * FROM place WHERE address='toronto'`);
    // console.log(foundPlace);
    const createdPlace = foundPlace[0];
    expect(createdPlace.id).toBe(placeResponse.body.insertId);
    expect(createdPlace.address).toBe(address.address);

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
  test('GET/api/activities/trip/:tripId should get all activities within the trip', async () => {
    const createResponse2 = await createActivity(activity2);
    expect(createResponse2.statusCode).toBe(200);

    const createResponse3 = await createActivity(activity3);
    expect(createResponse3.statusCode).toBe(200);

    const createResponse4 = await createActivity(activity4);
    expect(createResponse4.statusCode).toBe(200);

    const allActivities = await getAllActivities(3);
    expect(allActivities.body.length).toBe(3)
    // console.log(allActivities.body.length);
  });

  // test filtering

});

afterAll(async () => {
  await database.close();
});
