const {
	signin,
	signout,
	createUser,
	deleteUser,
  createTrip
} = require('./services');

const database = require('../database.js');

describe('Test /api/trips', () => {
	const user = {
		username: "testuser",
		password: "testpassword"
	};

	const trip = {
		name: "testtrip",
		startDate: new Date(2018, 11, 20),
		endDate: new Date(2018, 11, 30)
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

	test('This always passes', async () => {
		expect(200).toBe(200);
	});
});

afterAll(async () => {
	await database.close();
});