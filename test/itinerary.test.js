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
  starItinerary
} = require('./services');

const database = require('../database.js');

describe('Test /api/itineraries', () => {
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

	test('Create an itinerary using POST /api/itineraries', async () => {
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
		const createResponse = await createItinerary(itin);

		expect(createResponse.statusCode).toBe(200);
		expect(createResponse.body.name).toBe(name);
		expect(createResponse.body.tripId).toBe(tripId);
		expect(createResponse.body.starred).toBe(0);
	});

	test('Star an itinerary using PUT /api/itineraries/:id/star', async () => {
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
		const createResponse = await createItinerary(itin);
		expect(createResponse.statusCode).toBe(200);

		const starResponse = await starItinerary(createResponse.body.id);
		expect(starResponse.statusCode).toBe(200);
		expect(starResponse.body.name).toBe(name);
		expect(starResponse.body.tripId).toBe(tripId);
		expect(starResponse.body.starred).toBe(1);
	});

});

afterAll(async () => {
	await database.close();
});