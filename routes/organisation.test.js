/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../index');

describe('POST /organisation', () => {
  test('POST /organisation with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .post('/organisation')
      .send({
        name: 'epic gaymers',
        employee_num: 10
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

  test('POST /organisation with no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .post('/organisation')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('POST /organisation if the name of the organisation is not unique should return 409 (Conflict)', async () => {
    const response = await request(app)
      .post('/organisation')
      .set('x-access-token', userToken)
      .send({
        name: 'burger king',
        employee_num: 10
      });

    expect(response.statusCode).toBe(409);
  });

  test('POST /organisation with a valid body should return 201 (Created)', async () => {
    const response = await request(app)
      .post('/organisation')
      .set('x-access-token', userToken)
      .send({
        name: 'epic games',
        employee_num: 10
      });

    expect(response.statusCode).toBe(201);
  });

  test('POST /organisation with a valid body should return the created organisation', async () => {
    // get a random number between 0 and 1000
    const random = Math.floor(Math.random() * 1000);
    const response = await request(app)
      .post('/organisation')
      .set('x-access-token', userToken)
      .send({
        name: 'epic games ' + random,
        employee_num: 10
      });

    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('employee_num');
  });
});

describe('DELETE /organisation/:name', () => {
  test('DELETE /organisation/:name with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .delete('/organisation/epic games');

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

  test('DELETE /organisation/:name with a non-existing name should return 404 (Not Found)', async () => {
    const response = await request(app)
      .delete('/organisation/this organisation does not exist')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });
  
  test('DELETE /organisation/:name with a valid name should return 204 (No Content)', async () => {
    const response = await request(app)
      .delete('/organisation/epic games')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(204);
  });
});

describe('GET /organisation/:name/info', () => {
  test('GET /organisation/:name/info with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/organisation/burger king/info');

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

  test('GET /organisation/:name/info with a non-existing name should return 404 (Not Found)', async () => {
    const response = await request(app)
      .get('/organisation/this organisation does not exist/info')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('GET /organisation/:name/info with a valid name should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/organisation/burger king/info')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /organisation/:name/info with a valid name should return the organisation', async () => {
    const response = await request(app)
      .get('/organisation/burger king/info')
      .set('x-access-token', userToken);

    expect(response.body.data).toHaveProperty('name');
    expect(response.body.data).toHaveProperty('employee_num');
  });
});

describe('GET /organisation/:name/robots', () => {
  test('GET /organisation/:name/robots with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/organisation/burger king/robots');

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

  test('GET /organisation/:name/robots with a non-existing name should return 404 (Not Found)', async () => {
    const response = await request(app)
      .get('/organisation/this organisation does not exist/robots')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('GET /organisation/:name/robots with a valid name should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/organisation/burger king/robots')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /organisation/:name/robots with a valid name should return the organisation\'s robots\' ids', async () => {
    const response = await request(app)
      .get('/organisation/burger king/robots')
      .set('x-access-token', userToken);

    expect(response.body);
  });

  test('GET /organisation/:name/robots with an organisation that has no robots should return an empty array', async () => {
    const response = await request(app)
      .get('/organisation/kys/robots')
      .set('x-access-token', userToken);

    expect(response.body).toEqual([]);
  });
});

describe('PATCH /organisation/:name/robots', () => {
  test('PATCH /organisation/:name/robots with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .patch('/organisation/burger king/robots')
      .query({
        id_robot: '63ad9bddb59ae608b3fa842d'
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

  test('PATCH /organisation/:name/robots with a non-existing name should return 404 (Not Found)', async () => {
    const response = await request(app)
      .patch('/organisation/this organisation does not exist/robots')
      .set('x-access-token', userToken)
      .query({
        id_robot: '63ad9bddb59ae608b3fa842d'
      }).expect(404);
  });

  test('PATCH /organisation/:name/robots with a valid name and a non-existing robot id should return 404 (Not Found)', async () => {
    const response = await request(app)
      .patch('/organisation/burger king/robots')
      .set('x-access-token', userToken)
      .query({
        id_robot: '63ad9e38b59af808b3fa1431'
      }).expect(404);
  });

  test('PATCH /organisation/:name/robots with a robot that is already assigned to an organisation should return 409 (Conflict)', async () => {
    const response = await request(app)
      .patch('/organisation/burger king/robots')
      .set('x-access-token', userToken)
      .query({
        id_robot: '63ad9e38b59ae608b3fa8431'
      }).expect(409);
  });


  test('PATCH /organisation/:name/robots with a valid name and a valid robot id should return 200 (OK)', async () => {
    const response = await request(app)
      .patch('/organisation/burger king/robots')
      .set('x-access-token', userToken)
      .query({
        id_robot: '63ad9bd0b59ae608b3fa842a'
      }).expect(200);
  });
});

  
