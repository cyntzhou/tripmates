const {
  signin,
  signout,
  createUser,
  deleteUser,
  createPlace,
  editPlace,
  getPlace,
  addHours,
  createActivity,
  getActivity,
  editActivity,
  deleteActivity,
  getAllActivities,
  filterActivities,
  upvote,
  downvote,
  createTrip
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

const activity5 = {
  name: 'sleeping',
  tripId: 4,
  suggestedDuration: 30,
  placeId: 4,
  category: 'rest'
};

const trip = {
  name: "testtrip",
  startDate: "2018-12-20",
  endDate: "2018-12-30"
}

const place = {
  name: 'canada yay',
  address: 'toronto'
};

const place2 = {
  name: 'simmons',
  address: '222 vassar st'
};

const hours1 = {
  day: 2,
  startTime: '09:20:00',
  endTime: '09:50'
};

const hours2 = {
  day: 4,
  startTime: '11:40:00',
  endTime: '13:00'
};

describe('Test /api/activities', () => {
  beforeAll(async () => {
    await database.createTables();
  });

  beforeEach(async () => {
    await createUser(user);
    await signin(user);
    await createTrip(trip);
    await createTrip(trip);
    await createTrip(trip);
    await createTrip(trip);
    await createTrip(trip);
  });

  afterEach(async() => {
    await signout();
  });

  afterAll(async() => {
    await database.clearTables();
  });

  // tests create activity with null place, delete activity
  test('POST /activities should allow creating activity', async () => {
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
    expect(createdActivity.placeId).toBe(null);
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

    const placeResponse = await createPlace(place);
    expect(placeResponse.statusCode).toBe(200);

    const foundPlace = await database.query(`SELECT * FROM place WHERE address='toronto'`);
    const createdPlace = foundPlace[0];
    expect(createdPlace.id).toBe(placeResponse.body.insertId);
    expect(createdPlace.name).toBe(place.name);
    expect(createdPlace.address).toBe(place.address);

    // add hours
    const hoursResponse1 = await addHours(hours1, createdPlace.id);
    const hoursResponse2 = await addHours(hours2, createdPlace.id);

    const foundHours = await database.query(`SELECT * FROM openHours WHERE placeId='${createdPlace.id}'`);
    expect(foundHours.length).toBe(2);
  });

  // test get all activities within trip
  test('GET /trips/:tripId/activities should get all activities within the trip', async () => {
    const createResponse2 = await createActivity(activity2);
    expect(createResponse2.statusCode).toBe(200);

    const createResponse3 = await createActivity(activity3);
    expect(createResponse3.statusCode).toBe(200);

    const createResponse4 = await createActivity(activity4);
    expect(createResponse4.statusCode).toBe(200);

    const allActivities = await getAllActivities(3);
    // console.log(allActivities.body);

    expect(allActivities.body.length).toBe(3)
  });

  // test filtering
  test('GET /activities/category/:category should get all activities within the trip with the category', async () => {
    const filteredActivities = await filterActivities({ tripId: 3 }, 'food');
    expect(filteredActivities.body.length).toBe(2);
  });

  // test get and edit activity
  test('GET /api/activities/:id and PUT /api/activities/:id to edit activity duration and category, etc', async () => {
    const createResponse = await createActivity(activity5);
    let aId = createResponse.body.insertId;

    let activityRes = await getActivity(aId);
    // console.log(activityRes.body);
    expect(activityRes.body.name).toBe(activity5.name);
    expect(activityRes.body.category).toBe(activity5.category);
    expect(activityRes.body.suggestedDuration).toBe(activity5.suggestedDuration);
    const editted = {
      id: aId,
      name: 'waking',
      suggestedDuration: 20,
      placeId: 4,
      category: 'unrest'
    }
    const editResponse = await editActivity(aId, editted);
    let editActivityRes = await getActivity(aId);
    expect(editActivityRes.body.name).toBe(editted.name);
    expect(editActivityRes.body.category).toBe(editted.category);
    expect(editActivityRes.body.suggestedDuration).toBe(editted.suggestedDuration);
  });

  // test edit place, get place
  test('GET /api/activities/:id and PUT /api/activities/:id to edit activity duration and category, etc', async () => {
    const createResponse = await createPlace(place2);
    let pId = createResponse.body.insertId;

    const newActivity = {
      name: '6.170',
      tripId: 4,
      suggestedDuration: 30,
      placeId: pId,
      category: 'work'
    };

    let activityRes = await createActivity(newActivity);

    const newPlace = {
      name: 'simmons',
      address: '229 vassar st'
    }
    let editPlaceRes = await editPlace(pId, newPlace);
    let getPlaceRes = await getPlace(pId);
    expect(getPlaceRes.body.name).toBe(newPlace.name);
    expect(getPlaceRes.body.address).toBe(newPlace.address);
  });

});

afterAll(async () => {
  await database.close();
});
