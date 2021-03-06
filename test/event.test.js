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
  eventDuringOpenHours, // TODO delete this
  createPlace,
  addHours
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

  test('Test whether Events.duringOpenHours works on an event with no place using /api/events/test', async () => {
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

    const activity0 = {
      name: 'hiking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: null,
      category: 'nature'
    };
    const activityResponse0 = await createActivity(activity0);
    expect(activityResponse0.statusCode).toBe(200);
    const activityId0 = activityResponse0.body.insertId;

    const event0 = {
      activityId: activityId0,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    
    const duringOpenHoursResponse0 = await eventDuringOpenHours(event0);
    expect(duringOpenHoursResponse0.statusCode).toBe(200);
  });

  test('Test whether Events.duringOpenHours works on an event with place with no hours using /api/events/test', async () => {

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

    const place1 = {
      name: 'MIT',
      address: '77 Mass Ave'
    };

    const placeResponse1 = await createPlace(place1);
    expect(placeResponse1.statusCode).toBe(200);
    const placeId1 = placeResponse1.body.insertId;

    const activity1 = {
      name: 'hacking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: placeId1,
      category: 'MIT'
    };
    const activityResponse1 = await createActivity(activity1);
    expect(activityResponse1.statusCode).toBe(200);
    const activityId1 = activityResponse1.body.insertId;

    const event1 = {
      activityId: activityId1,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    
    const duringOpenHoursResponse1 = await eventDuringOpenHours(event1);
    expect(duringOpenHoursResponse1.statusCode).toBe(200);
  });

  test('Test whether Events.duringOpenHours works on an event with place with hours using /api/events/test', async () => {

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

    const place2 = {
      name: 'MIT',
      address: '77 Mass Ave'
    };

    const placeResponse2 = await createPlace(place2);
    expect(placeResponse2.statusCode).toBe(200);
    const placeId2 = placeResponse2.body.insertId;

    const hoursA = {
      day: 5,
      startTime: '09:20',
      endTime: '19:40'
    };

    const hoursB = {
      day: 1,
      startTime: '11:40',
      endTime: '23:00'
    };

    const hoursResponseA = await addHours(hoursA, placeId2);
    const hoursResponseB = await addHours(hoursB, placeId2);

    const activity2 = {
      name: 'hacking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: placeId2,
      category: 'MIT'
    };
    const activityResponse2 = await createActivity(activity2);
    expect(activityResponse2.statusCode).toBe(200);
    const activityId2 = activityResponse2.body.insertId;

    const event2 = {
      activityId: activityId2,
      start: "2018-12-20 17:30",
      end: "2018-12-20 18:30"
    };
    
    const duringOpenHoursResponse2 = await eventDuringOpenHours(event2);
    expect(duringOpenHoursResponse2.statusCode).toBe(200);

    const event2Closed = {
      activityId: activityId2,
      start: "2018-12-09 07:30",
      end: "2018-12-09 09:30"
    };

    const duringOpenHoursResponse2Closed = await eventDuringOpenHours(event2Closed);
    expect(duringOpenHoursResponse2Closed.statusCode).toBe(400);
  });

  test('Test whether Events.duringOpenHours works when event spans two days using /api/events/test', async () => {

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

    const place2 = {
      name: 'MIT',
      address: '77 Mass Ave'
    };

    const placeResponse2 = await createPlace(place2);
    expect(placeResponse2.statusCode).toBe(200);
    const placeId2 = placeResponse2.body.insertId;

    const hoursA = {
      day: 5,
      startTime: '09:20',
      endTime: '23:59'
    };

    const hoursB = {
      day: 6,
      startTime: '00:00',
      endTime: '17:00'
    };

    const hoursResponseA = await addHours(hoursA, placeId2);
    const hoursResponseB = await addHours(hoursB, placeId2);

    const activity2 = {
      name: 'hacking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: placeId2,
      category: 'MIT'
    };
    const activityResponse2 = await createActivity(activity2);
    expect(activityResponse2.statusCode).toBe(200);
    const activityId2 = activityResponse2.body.insertId;

    const event2 = {
      activityId: activityId2,
      start: "2018-12-20 23:00",
      end: "2018-12-21 01:30"
    };
    
    const duringOpenHoursResponse2 = await eventDuringOpenHours(event2);
    expect(duringOpenHoursResponse2.statusCode).toBe(200);

    const event3 = {
      activityId: activityId2,
      start: "2018-12-20 23:00",
      end: "2018-12-21 18:30"
    };
    
    const duringOpenHoursResponse3 = await eventDuringOpenHours(event3);
    expect(duringOpenHoursResponse3.statusCode).toBe(400);
  });

  test('Test whether Events.duringOpenHours works when event spans more than two days using /api/events/test', async () => {

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

    const place2 = {
      name: 'MIT',
      address: '77 Mass Ave'
    };

    const placeResponse2 = await createPlace(place2);
    expect(placeResponse2.statusCode).toBe(200);
    const placeId2 = placeResponse2.body.insertId;

    const hoursA = {
      day: 5,
      startTime: '09:20',
      endTime: '23:59'
    };

    const hoursB = {
      day: 6,
      startTime: '00:00',
      endTime: '23:59'
    };

    const hoursC = {
      day: 7,
      startTime: '00:00',
      endTime: '03:00'
    };

    const hoursResponseA = await addHours(hoursA, placeId2);
    const hoursResponseB = await addHours(hoursB, placeId2);
    const hoursResponseC = await addHours(hoursC, placeId2);

    const activity2 = {
      name: 'hacking',
      tripId: tripId,
      suggestedDuration: 30,
      placeId: placeId2,
      category: 'MIT'
    };
    const activityResponse2 = await createActivity(activity2);
    expect(activityResponse2.statusCode).toBe(200);
    const activityId2 = activityResponse2.body.insertId;

    const event2 = {
      activityId: activityId2,
      start: "2018-12-20 23:00",
      end: "2018-12-22 01:30"
    };
    
    const duringOpenHoursResponse2 = await eventDuringOpenHours(event2);
    expect(duringOpenHoursResponse2.statusCode).toBe(200);

    const event3 = {
      activityId: activityId2,
      start: "2018-12-20 23:00",
      end: "2018-12-22 03:01"
    };
    
    const duringOpenHoursResponse3 = await eventDuringOpenHours(event3);
    expect(duringOpenHoursResponse3.statusCode).toBe(400);
  });

});

afterAll(async () => {
  await database.close();
});