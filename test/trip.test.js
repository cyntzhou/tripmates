const {
	signin,
	signout,
	createUser,
	deleteUser,
  createTrip,
  updateTrip,
  findMyTrips
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
		// await createUser(user);
	});

	beforeEach(async () => {
		await createUser(user);
	});

	afterEach(async () => {
		await signout();
	});

	afterAll(async () => {
		// await database.clearTables();
	});

	// TODO: test the situations in which you should get errors (not logged in, not member of trip, all the different cases for dates, etc.)

	test('Create a trip with POST /api/trips', async () => {
		const userResponse = await signin(user);
		expect(userResponse.statusCode).toBe(200);

		const response = await createTrip(trip);
		expect(response.statusCode).toBe(200);
		expect(response.body.name).toBe(trip.name);
		expect(response.body.creatorId).toBe(userResponse.body.id);
		expect((response.body.startDate).slice(0, 10)).toBe(trip.startDate);
		expect((response.body.endDate).slice(0, 10)).toBe(trip.endDate);
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
		expect((response.body.startDate).slice(0, 10)).toBe(newStart);
		expect((response.body.endDate).slice(0, 10)).toBe(newEnd);
	});

	// Currently this only tests for trips you created, since join trips hasn't been implemented yet
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
		expect(response.body).toEqual(expect.arrayContaining([{tripId: tripId0}, {tripId: tripId1}, {tripId: tripId2}]));
	});

});

afterAll(async () => {
	await database.close();
});