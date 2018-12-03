const {
  signin,
  signout,
  createUser,
  deleteUser,
  createTrip,
  updateTrip,
  findMyTrips,
  deleteTrip,
  createItinerary,
  starItinerary,
  unstarItinerary,
  createActivity,
  createEvent,
  updateEvent,
  deleteEvent,
  eventDuringOpenHours // TODO delete this
} = require('./services');

const database = require('../database.js');

describe('Test /api/events', () => {
  const user = {
    username: "testuser",
    password: "testpassword"
  };

  const trip = {
    name: "testtrip",
    startDate: "2018-12-20",
    endDate: "2018-12-30"
  }

  beforeAll(async () => {
    await database.createTables();
  });

  beforeEach(async () => {
    await createUser(user);
  });

  afterEach(async () => {
    await signout();
  });

  afterAll(async () => {
    await database.clearTables();
  });

  // TODO: test the situations in which you should get errors (not logged in, not member of trip, all the different cases for dates, etc.)

  test('Create an event using POST /api/events', async () => {
    const userResponse = await signin(user);
    expect(userResponse.statusCode).toBe(200);

    const tripResponse = await createTrip(trip);
    expect(tripResponse.statusCode).toBe(200);
    const tripId = tripResponse.body.id;

    const name = "My itinerary";
    const itin = {
      name: name,
      tripId: tripId
    };
    const itinResponse = await createItinerary(itin);
    expect(itinResponse.statusCode).toBe(200);

    const activity = {
      name: 'hiking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: null,
      category: 'nature'
    };
    const activityResponse = await createActivity(activity);
    expect(activityResponse.statusCode).toBe(200);
    const activityId = activityResponse.body.insertId;

    const event = {
      itineraryId: itinResponse.body.id,
      activityId: activityId,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    const eventResponse = await createEvent(event);
    expect(eventResponse.statusCode).toBe(200);
    expect(eventResponse.body.itineraryId).toBe(event.itineraryId);
    expect(eventResponse.body.activityId).toBe(event.activityId);
    expect(eventResponse.body.startDateTime).toBe(event.start);
    expect(eventResponse.body.endDateTime).toBe(event.end);
  });

  test('Update date/time range of event using PUT /api/events/:id', async () => {
    const userResponse = await signin(user);
    expect(userResponse.statusCode).toBe(200);

    const tripResponse = await createTrip(trip);
    expect(tripResponse.statusCode).toBe(200);
    const tripId = tripResponse.body.id;

    const name = "My itinerary";
    const itin = {
      name: name,
      tripId: tripId
    };
    const itinResponse = await createItinerary(itin);
    expect(itinResponse.statusCode).toBe(200);

    const activity = {
      name: 'hiking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: null,
      category: 'nature'
    };
    const activityResponse = await createActivity(activity);
    expect(activityResponse.statusCode).toBe(200);
    const activityId = activityResponse.body.insertId;

    const event = {
      itineraryId: itinResponse.body.id,
      activityId: activityId,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    const eventResponse = await createEvent(event);
    expect(eventResponse.statusCode).toBe(200);

    const newTimes = {
      newStart: "2018-12-22 11:00",
      newEnd: "2018-12-22 12:45"
    };
    const updateResponse = await updateEvent(eventResponse.body.id, newTimes);
    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.itineraryId).toBe(event.itineraryId);
    expect(updateResponse.body.activityId).toBe(event.activityId);
    expect(updateResponse.body.startDateTime).toBe(newTimes.newStart);
    expect(updateResponse.body.endDateTime).toBe(newTimes.newEnd);
  });

  test('Delete an event using DELETE /api/events/:id', async () => {
    const userResponse = await signin(user);
    expect(userResponse.statusCode).toBe(200);

    const tripResponse = await createTrip(trip);
    expect(tripResponse.statusCode).toBe(200);
    const tripId = tripResponse.body.id;

    const name = "My itinerary";
    const itin = {
      name: name,
      tripId: tripId
    };
    const itinResponse = await createItinerary(itin);
    expect(itinResponse.statusCode).toBe(200);

    const activity = {
      name: 'hiking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: null,
      category: 'nature'
    };
    const activityResponse = await createActivity(activity);
    expect(activityResponse.statusCode).toBe(200);
    const activityId = activityResponse.body.insertId;

    const event = {
      itineraryId: itinResponse.body.id,
      activityId: activityId,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    const eventResponse = await createEvent(event);
    expect(eventResponse.statusCode).toBe(200);

    const deleteResponse = await deleteEvent(eventResponse.body.id);
    expect(deleteResponse.statusCode).toBe(200);
    const eventFindResults = await database.query(`SELECT * FROM event WHERE id='${eventResponse.body.id}';`);
    expect(eventFindResults.length).toBe(0);
  });

  test('Test whether Events.duringOpenHours works using /api/events/test', async () => { // TODO: delete this
    const userResponse = await signin(user);
    expect(userResponse.statusCode).toBe(200);

    const tripResponse = await createTrip(trip);
    expect(tripResponse.statusCode).toBe(200);
    const tripId = tripResponse.body.id;

    const name = "My itinerary";
    const itin = {
      name: name,
      tripId: tripId
    };
    const itinResponse = await createItinerary(itin);
    expect(itinResponse.statusCode).toBe(200);

    const activity = {
      name: 'hiking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: null,
      category: 'nature'
    };
    const activityResponse = await createActivity(activity);
    expect(activityResponse.statusCode).toBe(200);
    const activityId = activityResponse.body.insertId;

    const event = {
      activityId: activityId,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    
    const duringOpenHoursResponse = await eventDuringOpenHours(event);
    expect(duringOpenHoursResponse.statusCode).toBe(200);
    console.log("duringOpenHoursResponse: " + duringOpenHoursResponse);
  });

});

afterAll(async () => {
  await database.close();
});