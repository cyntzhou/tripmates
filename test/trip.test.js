const {
	signin,
	signout,
	createUser,
	deleteUser,
	createTrip,
	updateTrip,
	findMyTrips,
	deleteTrip,
	getTripDetails,
	getItinerariesOfTrip,
  createItinerary,
  starItinerary,
  unstarItinerary,
  createActivity,
  renameItinerary,
  deleteItinerary
} = require('./services');

const database = require('../database.js');

describe('Test /api/trips', () => {
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

	test('Create a trip with POST /api/trips', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const response = await createTrip(trip);
		expect(response.statusCode).toBe(200);
		expect(response.body.name).toBe(trip.name);
		expect(response.body.creatorId).toBe(userResponse.body.id);
		expect(response.body.startDate).toBe(trip.startDate);
		expect(response.body.endDate).toBe(trip.endDate);
	});

	test('Edit trip details with PUT /api/trips/:id', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const createResponse = await createTrip(trip);
		expect(createResponse.statusCode).toBe(200);
		const tripId = createResponse.body.id;

		const newName = "updated trip name";
		const newStart = "2019-01-07";
		const newEnd = "2019-01-23";
		const newTrip = {newName: newName, newStart: newStart, newEnd: newEnd};

		const response = await updateTrip(tripId, newTrip);
		expect(response.statusCode).toBe(200);
		expect(response.body.name).toBe(newName);
		expect(response.body.creatorId).toBe(userResponse.body.id);
		expect(response.body.startDate).toBe(newStart);
		expect(response.body.endDate).toBe(newEnd);
	});

	// This only tests for trips you created, since join trips hasn't been implemented yet
	test('Get IDs of all trips you are a member of with GET /api/users/:userId/trips', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const createResponse0 = await createTrip(trip);
		expect(createResponse0.statusCode).toBe(200);
		const tripId0 = createResponse0.body.id;

		const createResponse1 = await createTrip(trip);
		expect(createResponse1.statusCode).toBe(200);
		const tripId1 = createResponse1.body.id;

		const createResponse2 = await createTrip(trip);
		expect(createResponse2.statusCode).toBe(200);
		const tripId2 = createResponse2.body.id;

		const response = await findMyTrips(userResponse.body.id);
		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual(expect.arrayContaining([{tripId: tripId0}, {tripId: tripId1}, {tripId: tripId2}]));
	});

	test('Delete a trip using DELETE /api/trips/:id', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const createResponse = await createTrip(trip);
		expect(createResponse.statusCode).toBe(200);
		const tripId = createResponse.body.id;

		const response = await deleteTrip(tripId);
		expect(response.statusCode).toBe(200);

		const tripFindResults = await database.query(`SELECT * FROM trip WHERE id='${tripId}';`);
		expect(tripFindResults.length).toBe(0);

		const findResponse = await findMyTrips(userResponse.body.id);
		expect(findResponse.body).toEqual(expect.not.arrayContaining([{tripId: tripId}]));
	});

	test('Get trip details using GET /api/trips/:id', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const createResponse = await createTrip(trip);
		expect(createResponse.statusCode).toBe(200);
		const tripId = createResponse.body.id;

		const tripDetails = await getTripDetails(tripId);
		expect(tripDetails.statusCode).toBe(200);
		expect(tripDetails.body.name).toBe(trip.name);
		expect(tripDetails.body.startDate).toBe(trip.startDate);
		expect(tripDetails.body.endDate).toBe(trip.endDate);
		expect(tripDetails.body.members).toEqual(expect.arrayContaining([user.username]));
		expect(tripDetails.body.members.length).toBe(1);
	});

	test('Get all itineraries for a trip using GET /api/trips/:id/itineraries', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const tripResponse = await createTrip(trip);
		expect(tripResponse.statusCode).toBe(200);
		const tripId = tripResponse.body.id;

		const name0 = "My itinerary";
		const itin0 = {
			name: name0,
			tripId: tripId
		};
		const itinResponse0 = await createItinerary(itin0);
		expect(itinResponse0.statusCode).toBe(200);

		const name1 = "My other itinerary";
		const itin1 = {
			name: name1,
			tripId: tripId
		};
		const itinResponse1 = await createItinerary(itin1);
		expect(itinResponse1.statusCode).toBe(200);

		const getItinsResponse = await getItinerariesOfTrip(tripId);
		expect(getItinsResponse.statusCode).toBe(200);
		expect(getItinsResponse.body.length).toBe(2);
		expect(getItinsResponse.body).toEqual(expect.arrayContaining([itinResponse0.body, itinResponse1.body]));
	});

});

afterAll(async () => {
	await database.close();
});