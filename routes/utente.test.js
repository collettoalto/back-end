/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('../index');

describe('POST /utente/signup', () => {
  test('POST /utente/signup with no body should return 400 (no body provided)', async () => {
    const response = await request(app).post('/utente/signup');
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/signup with no username should return 400 (no username provided)', async () => {
    const response = await request(app).post('/utente/signup').send({
      password: "password",
      email: "email",
      numero_tel: "numero_tel"
    });
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/signup with an already existing username should return 409 (username already taken)', async () => {
    const response = await request(app).post('/utente/signup').send({
      username: "yomama",
      password: "password",
      email: "email",
      numero_tel: "numero_tel"
    });

    expect(response.statusCode).toBe(409);
  });

  test('POST /utente/signup with the correct information should return 201 (user created)', async () => {
    // get random number to avoid username collision
    const randomNumber = Math.floor(Math.random() * 1000000);
    const response = await request(app).post('/utente/signup').send({
      username: "supercoolusername" + randomNumber,
      password: "password",
      email: "email",
      numero_tel: "numero_tel"
    });

    expect(response.statusCode).toBe(201);
  });
});

describe('POST /utente/login', () => {
  test('POST /utente/login with no body should return 400 (no body provided)', async () => {
    const response = await request(app).post('/utente/login');
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/login with no username should return 400 (no username provided)', async () => {
    const response = await request(app).post('/utente/login').send({
      password: "password"
    });
    expect(response.statusCode).toBe(400);
  });

  test('POST /utente/login with a username that doesn\'t exist should return 404 (user not found)', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "thisusernameisnotreal",
      password: "password"
    });

    expect(response.statusCode).toBe(404);
  });

  test('POST /utente/login with the correct username but wrong password should return 401 (Wrong password)', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "wrongpassword"
    });

    expect(response.statusCode).toBe(401);
  });

  test('POST /utente/login with the correct information should return 200', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "sofat"
    });

    expect(response.statusCode).toBe(200);
  });

  test('POST /utente/login with the correct information should return a token', async () => {
    const response = await request(app).post('/utente/login').send({
      username: "yomama",
      password: "sofat"
    });

    expect(response.body.token).toBeDefined();
  });
});

describe('GET /utente/profile', () => {

  // Moking User.findOne method
  let userSpy;
/*
  beforeAll( () => {
    const User = require('../models/utente');
    userSpy = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      return {
        username: "yomama",
        hash_password: 'c8b8e8c73041befc44be28aa6a77d6f0ca3b045fcabf46a07574cfa765647cd8'
      };
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
  });
*/
  test('GET /utente/profile with no token should return 400 (no token provided)', async () => {
    const response = await request(app).get('/utente/profile');
    expect(response.statusCode).toBe(400);
  });

  test('GET /utente/profile with an invalid token should return 401', async () => {
    const response = await request(app)
      .get('/utente/profile')
      .set('x-access-token', 'invalid token');
    expect(response.statusCode).toBe(401);
  });

  // create a valid token
  var payload = {
    username: 'yomama',
    id: '63ab0717ff42ca4d83e885dd'
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
  test('GET /utente/profile with a valid token should return 200', async () => {
    expect.assertions(1);
    const response = await request(app)
      .get('/utente/profile')
      .set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });

  test('GET /utente/profile with a valid token should return user information', async () => {
    expect.assertions(2);
    const response = await request(app)
      .get('/utente/profile')
      .set('x-access-token', token);
    const user = response.body.profile;
    expect(user).toBeDefined();
    expect(user.username).toBe('yomama');
  });
});

describe('GET /utente/organisations', () => {
  test('GET /utente/organisations with no token should return 400 (no token provided)', async () => {
    const response = await request(app).get('/utente/organisations');
    expect(response.statusCode).toBe(400);
  });

  test('GET /utente/organisations with an invalid token should return 401', async () => {
    const response = await request(app)
      .get('/utente/organisations')
      .set('x-access-token', 'invalid token');
    expect(response.statusCode).toBe(401);
  });

  // create a valid token
  var payload = {
    username: 'yomama',
    id: '63ab0717ff42ca4d83e885dd'
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var token = jwt.sign(payload, process.env.SUPER_SECRET, options);
      
  test('GET /utente/organisations with a valid token should return 200', async () => {
    expect.assertions(1);
    const response = await request(app)
      .get('/utente/organisations')
      .set('x-access-token', token);
    expect(response.statusCode).toBe(200);
  });

  test('GET /utente/organisations with a valid token should return organisations', async () => {
    expect.assertions(1);
    const response = await request(app)
      .get('/utente/organisations')
      .set('x-access-token', token);
    const orgs = response.body.nomi_organizzazioni;
    expect(orgs).toBeDefined();
  });
});