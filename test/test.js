const {
    signin,
    signout,
    createUser,
    deleteUser
} = require('./services');

const database = require('../database.js');
const sqlInjection = "hi'; DROP TABLE upvotes; SELECT * FROM users WHERE username='hi";
const injectionUser = {
    username: sqlInjection,
    // username: `hi'; DELETE FROM users WHERE username='hi`,
    password: `bye`
};
const user = {
    username: `hi`,
    password: `bye`
};

describe('Test /api/users', () => {
    beforeAll(async () => {
        await database.createTables();
    });

    afterEach(async() => {
        await signout();
    });

    afterAll(async() => {
        await database.clearTables();
    });

    // tests create, sign in, delete account - should pass
    test('POST /users/signin should reject attempt to sign in directly with queried username and password', async () => {
      let og_user = {
        username: 'sophia',
        password: 'lee'
      };

      const createResponse = await createUser(og_user);
      expect(createResponse.statusCode).toBe(200);

      const signInResponse = await signin(user);
      expect(signInResponse.statusCode).toBe(200);

      await expect(database.query(`SELECT * FROM user WHERE username='sophia'`)).resolves.toBeDefined();

      let query = await database.query(`SELECT id FROM user WHERE username='sophia'`);
      let id = query[0].id;

      const deleteResponse = await deleteUser(id);
      expect(deleteResponse.statusCode).toBe(200);
    });

    // ------ old stuff ------

    // should pass
    // test('SQL INJECTION: POST api/users should use prepared statements and prevent attempt to drop table', async () => {
    //     await database.query(`DELETE FROM users WHERE username=?`, sqlInjection);
    //     const createUserResponse = await createUser(injectionUser);
    //     await expect(database.query(`SELECT * FROM upvotes`)).resolves.toBeDefined();
    // });

    // should pass
    // test('Cross-Site Scripting (XSS): POST api/freets should sanitize Freet content in a XSS attempt', async () => {
    //     const createUserResponse = await createUser(user);
    //     const signinResponse = await signin(user);
    //     const content = '<img src="https://i.ytimg.com/vi/W-PBFMECvTE/maxresdefault.jpg"><script>alert()</script>';
    //     const response = await createFreet(content);
    //     // should be sanitized and not contain unsafe tags
    //     expect(response.body.content.includes("<script>")).toBe(false);
    //     await signout();
    // });

    // should pass
    // test('Bad Authentication: someone who has access to database shouldnt be able to obtain password of another user and log in', async () => {
    //     const retrievedUser = await database.query(`SELECT * FROM users WHERE username='${user.username}'`).then(res => res);
    //     const response = await signin({
    //         username: retrievedUser[0].username,
    //         password: retrievedUser[0].password
    //     });
    //     expect(response.statusCode).toBe(401);
    // });

    // should fail
    // test('Cross-Site Request Forgery (CSRF): POST api/freets should reject if request does not contain CSRF token', async () => {
    //     await signin(user);
    //     const content = 'new freet';
    //     const response = await createFreet(content);
    //     expect(response.statusCode).toBe(400);
    // });

    // should pass
    // test('Integrity Violation: PUT api/freets/:id should reject integrity violation attempt to edit freet of a deleted user', async () => {
    //     const signinResponse = await signin(user);
    //     const userInfo = signinResponse.body;
    //     const content = 'new freet';
    //     const createFreetResponse = await createFreet(content);
    //     const freetId = createFreetResponse.body.id;
    //     await deleteUser(userInfo.id);
    //
    //     // check that freet has also been deleted
    //     const deletedFreet = await database.query(`SELECT * FROM freets WHERE id='${freetId}'`).then(res => res);
    //     expect(deletedFreet.length).toBe(0);
    // });
});

afterAll(async () => {
    await database.close();
});
