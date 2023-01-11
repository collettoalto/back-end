/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../index');

describe('POST /zone', () => {
  test('POST /zone with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .post('/zone')
      .send({
        regione: [
          {
            LAT: 45.123,
            LON: 7.123,
            ALT: 123
          }
        ],
        contenitori_rifiuti: [
          {
            tipologia: 'plastica',
            posizione: {
              LAT: 45.123,
              LON: 7.123,
              ALT: 123
            }
          }
        ]
      });

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
  var userToken = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('POST /zone with no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .post('/zone')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('POST /zone with a valid body should return 201 (Created)', async () => {
    const response = await request(app)
      .post('/zone')
      .set('x-access-token', userToken)
      .send({
        regione: [
          {
            LAT: 45.123,
            LON: 7.123,
            ALT: 123
          }
        ],
        contenitori_rifiuti: [
          {
            tipologia: 'plastica',
            posizione: {
              LAT: 45.123,
              LON: 7.123,
              ALT: 123
            }
          }
        ]
      });

    expect(response.statusCode).toBe(201);
  });
});

describe('GET /zone/position/:id', () => {
  test('GET /zone/position/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/zone/position/10');

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
  var userToken = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('GET /zone/position/:id with no id should return 404 (no id provided)', async () => {
    const response = await request(app)
      .get('/zone/position/')
      .set('x-access-token', userToken);
      
    expect(response.statusCode).toBe(404);
  });

  test('GET /zone/position/:id with a valid id should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/zone/position/10')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /zone/position/:id with a valid id should return the region', async () => {
    const response = await request(app)
      .get('/zone/position/10')
      .set('x-access-token', userToken);

    expect(response.body.region).toBeDefined();
  });
});

describe('GET /zone/containers/:id', () => {
  test('GET /zone/containers/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/zone/containers/10');

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
  var userToken = jwt.sign(payload, process.env.SUPER_SECRET, options);

  test('GET /zone/containers/:id with no id should return 404 (no id provided)', async () => {
    const response = await request(app)
      .get('/zone/containers/')
      .set('x-access-token', userToken);
      
    expect(response.statusCode).toBe(404);
  });

  test('GET /zone/containers/:id with a valid id should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/zone/containers/10')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /zone/containers/:id with a valid id should return the containers', async () => {
    const response = await request(app)
      .get('/zone/containers/10')
      .set('x-access-token', userToken);

    expect(response.body.contenitori_rifiuti).toBeDefined();
  });
});