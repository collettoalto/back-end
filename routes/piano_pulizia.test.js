/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../index');

describe('POST /piano_pulizia', () => {
  test('POST /piano_pulizia with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .send({
        id_zona: 1,
        data_inizio: '2023-03-02',
        data_fine: '2023-03-10',
        nome_organizzazione: 'burger king',
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

  test('POST /piano_pulizia with no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('POST /piano_pulizia if the start date is after the end date should return 400 (start date is after end date)', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .set('x-access-token', userToken)
      .send({
        id_zona: 1,
        data_inizio: '2023-03-02',
        data_fine: '2023-03-01',
        nome_organizzazione: 'burger king',
      });

    expect(response.statusCode).toBe(400);
  });

  test('POST /piano_pulizia if the start date is before the current date should return 400 (start date is before current date)', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .set('x-access-token', userToken)
      .send({
        id_zona: 1,
        data_inizio: '2020-03-02',
        data_fine: '2020-03-10',
        nome_organizzazione: 'burger king',
      });
      
    expect(response.statusCode).toBe(400);
  });

  test('POST /piano_pulizia with a valid body should return 201 (Created)', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .set('x-access-token', userToken)
      .send({
        id_zona: 1,
        data_inizio: '2023-03-02',
        data_fine: '2023-03-10',
        nome_organizzazione: 'burger king',
      });

    expect(response.statusCode).toBe(201);
  });

  test('POST /piano_pulizia with a valid body should return the created plan', async () => {
    const response = await request(app)
      .post('/piano_pulizia')
      .set('x-access-token', userToken)
      .send({
        id_zona: 1,
        data_inizio: '2023-03-02',
        data_fine: '2023-03-10',
        nome_organizzazione: 'burger king',
      });

    expect(response.body._id).toBeDefined();
    expect(response.body.ID_zona).toBeDefined();
    expect(response.body.data_inizio).toBeDefined();
    expect(response.body.data_fine).toBeDefined();
    expect(response.body.nome_organizzazione).toBeDefined();
  });
});

describe('GET /piano_pulizia/list', () => {
  test('GET /piano_pulizia/list with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/list');

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

  test('GET /piano_pulizia/list with a valid token but no organisation name in query should return 400 (no organisation name provided)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/list')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('GET /piano_pulizia/list with a valid token and organisation name in query should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/list')
      .set('x-access-token', userToken)
      .query({ nome_org: 'burger king' }).expect(200);
  });

  test('GET /piano_pulizia/list with a valid token and organisation name in query should return an array of plans', async () => {
    const response = await request(app)
      .get('/piano_pulizia/list')
      .set('x-access-token', userToken)
      .query({ nome_org: 'burger king' }).expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });
});

describe('GET /piano_pulizia/organization/:id', () => {
  test('GET /piano_pulizia/organization/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization/63ada507aa8c53c4c93e97bd');

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

  test('GET /piano_pulizia/organization/:id with a valid token but no plan id in params should return 404 (no plan id provided)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('GET /piano_pulizia/organization/:id with a valid token but no plan exists with the given id should return 404 (plan not found)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization/63adb507aa8c53c4c15e97be')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('GET /piano_pulizia/organization/:id with a valid token and plan id in params should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization/63ada507aa8c53c4c93e97bd')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /piano_pulizia/organization/:id with a valid token and plan id in params should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization/63ada507aa8c53c4c93e97bd')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(200);
  });

  test('GET /piano_pulizia/organization/:id with a valid token and plan id in params return the details of the plan', async () => {
    const response = await request(app)
      .get('/piano_pulizia/organization/63ada507aa8c53c4c93e97bd')
      .set('x-access-token', userToken);

    expect(response.body._id).toBeDefined();
    expect(response.body.ID_zona).toBeDefined();
    expect(response.body.data_inizio).toBeDefined();
    expect(response.body.data_fine).toBeDefined();
    expect(response.body.nome_organizzazione).toBeDefined();
  });
});

describe('GET /piano_pulizia/robot', () => {
  test('GET /piano_pulizia/robot with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/robot');

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    id: '63b2bd7a42836cc241171a38',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('GET /piano_pulizia/robot with a valid token but the robot doesn\'t have a plan assigned should return 404 (no plan assigned)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/robot')
      .set('x-access-token', token);

    console.log(response.body);

    expect(response.statusCode).toBe(404);
  });
  
  // create a valid token
  payload2 = {
    id: '63b2bd7b42836cc241171a3d',
    nome_organizzazione: "burger king"
  };
  token2 = jwt.sign(payload2, process.env.SUPER_SECRET);

  test('GET /piano_pulizia/robot with a valid token and the robot has a plan assigned should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/piano_pulizia/robot')
      .set('x-access-token', token2);

    expect(response.statusCode).toBe(200);
  });

  test('GET /piano_pulizia/robot with a valid token and the robot has a plan assigned should return the plan details', async () => {
    const response = await request(app)
      .get('/piano_pulizia/robot')
      .set('x-access-token', token2);

    expect(response.body._id).toBeDefined();
    expect(response.body.ID_zona).toBeDefined();
    expect(response.body.data_inizio).toBeDefined();
    expect(response.body.data_fine).toBeDefined();
    expect(response.body.nome_organizzazione).toBeDefined();
  });
});

describe('PATCH /piano_pulizia', () => {
  test('PATCH /piano_pulizia with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .patch('/piano_pulizia');

    expect(response.statusCode).toBe(400);
  });

  // create a valid token
  var payload = {
    id: '63b2ed7a42839ac241171a02',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('PATCH /piano_pulizia with a valid token but the robot doesn\'t exist should return 404 (robot not found)', async () => {
    const response = await request(app)
      .patch('/piano_pulizia')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(404);
  });

  // create a valid token
  payload2 = {
    id: '63b2bd7b42836cc241171a3d',
    nome_organizzazione: "burger king"
  };
  token2 = jwt.sign(payload2, process.env.SUPER_SECRET);

  test('PATCH /piano_pulizia with a valid token but the robot is already assigned to a plan should return 409 (robot already assigned to a plan)', async () => {
    const response = await request(app)
      .patch('/piano_pulizia')
      .set('x-access-token', token2);

      console.log(response.body);

    expect(response.statusCode).toBe(409);
  });

  // create a valid token
  payload3 = {
    id: '63b2bd7b42836cc241171a3d',
    nome_organizzazione: "burger king"
  };
  token3 = jwt.sign(payload3, process.env.SUPER_SECRET);
  
  test('PATCH /piano_pulizia with a valid token and the robot doesn\'t have a plan assigned should return 200 (OK)', async () => {
    const response = await request(app)
      .patch('/piano_pulizia')
      .set('x-access-token', token3);

    expect(response.statusCode).toBe(200);
  });
}); 


  
