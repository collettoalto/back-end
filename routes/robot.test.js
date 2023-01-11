/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../index');

describe('POST /robot', () => {
  test('POST /robot with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .post('/robot')
      .send({
        capienza_attuale: 10
      });

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    username: 'winx',
    id: '63ab93d9a48293d310fc51a0'
  }
  var options = {
    expiresIn: 86400 // expires in 24 hours
  }
  var userToken = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('POST /robot with no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .post('/robot')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('POST /robot if the user is not an admin should return 403 (Forbidden)', async () => {
    const response = await request(app)
      .post('/robot')
      .set('x-access-token', userToken)
      .send({
        capienza_attuale: 10
      });

    expect(response.statusCode).toBe(403);
  });

  // create a valid admin token
  payload = {
    username: 'yomama',
    id: '63ab0717ff42ca4d83e885dd'
  }
  var adminToken = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('POST /robot with a valid body should return 201 (Created)', async () => {
    const response = await request(app)
      .post('/robot')
      .set('x-access-token', adminToken)
      .send({
        capienza_attuale: Math.floor(Math.random() * 100)
      });

    expect(response.statusCode).toBe(201);
  });

  test('POST /robot with a valid body should return the id and token of the robot', async () => {
    const response = await request(app)
      .post('/robot')
      .set('x-access-token', adminToken)
      .send({
        capienza_attuale: Math.floor(Math.random() * 100)
      });

      console.log("Inside POST /robot"),
      console.log(response.body);

    expect(response.body.id).toBeDefined();
    expect(response.body.token).toBeDefined();
  });
});

describe('GET /robot/:id', () => {
  test('GET /robot/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/robot/63ad7d13b59ae608b3fa839a');

    expect(response.statusCode).toBe(400);
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

  test('GET /robot/:id with no id should return 404 (Not found)', async () => {
    const response = await request(app)
      .get('/robot/')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(404);
  });

  test('GET /robot/:id with a valid id should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/robot/63ad7d13b59ae608b3fa839a')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(200);
  });

  test('GET /robot/:id with a valid id should return the robot', async () => {
    const response = await request(app)
      .get('/robot/63ad7d13b59ae608b3fa839a')
      .set('x-access-token', token);

    expect(response.body).toBeDefined();
  });

  test('GET /robot/:id with a valid id should return the robot with the correct id', async () => {
    const response = await request(app)
      .get('/robot/63ad7d13b59ae608b3fa839a')
      .set('x-access-token', token);

    expect(response.body._id).toBe('63ad7d13b59ae608b3fa839a');
  });
});

describe('PUT /robot', () => {
  test('PUT /robot with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .put('/robot')
      .send({
        capienza_attuale: 10
      });

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    id: '63ad7d13b59ae608b3fa839a',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('PUT /robot without a valid body should return 400 (Bad request)', async () => {
    const response = await request(app)
      .put('/robot')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(400);
  });

  test('PUT /robot with a valid id should return 200 (OK)', async () => {
    const response = await request(app)
      .put('/robot')
      .set('x-access-token', token)
      .send({
        capienza_attuale: Math.floor(Math.random() * 100),
        temperatura: Math.floor(Math.random() * 100),
        batteria: Math.floor(Math.random() * 100),
        posizione: {
          LAT: Math.floor(Math.random() * 100),
          LON: Math.floor(Math.random() * 100),
          ALT: Math.floor(Math.random() * 100)
        }
      });

      console.log(response.body);
    expect(response.statusCode).toBe(200);
  });
});