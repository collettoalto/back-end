/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app = require('../index');

describe('POST /rifiuto', () => {
  test('POST /rifiuto with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .post('/rifiuto')
      .send({
        URL_foto: 'https://www.google.com',
        posizione: {
          LAT: 45.123,
          LNG: 7.123,
          ALT: 123
        }
      });

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    id: '63b2ed7a42839ac241171a02',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('POST /rifiuto with no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .post('/rifiuto')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(400);
  });

  var payload2 = {
    id: '63b2ed5a42819ac241171b60',
    nome_organizzazione: "burger king"
  };
  var token2 = jwt.sign(payload2, process.env.SUPER_SECRET);

  test('POST /rifiuto with a valid body but the robot doesn\'t exist should return 404 (robot not found)', async () => {
    const response = await request(app)
      .post('/rifiuto')
      .set('x-access-token', token2)
      .send({
        URL_foto: 'https://www.google.com',
        posizione: {
          LAT: 45.123,
          LNG: 7.123,
          ALT: 123
        }
      });

      console.log(response.body);

    expect(response.statusCode).toBe(404);
  });

  test('POST /rifiuto with a valid body but the robot isn\'t assigned to any plan should return 404 (robot not assigned to any plan)', async () => {
    const response = await request(app)
      .post('/rifiuto')
      .set('x-access-token', token)
      .send({
        URL_foto: 'https://www.google.com',
        posizione: {
          LAT: 45.123,
          LNG: 7.123,
          ALT: 123
        }
      });

    expect(response.statusCode).toBe(404);
  });

  var payload3 = {
    id: '63b1a4bef24bcf19150d3d3d',
    nome_organizzazione: "burger king"
  };
  var token3 = jwt.sign(payload3, process.env.SUPER_SECRET);

  test('POST /rifiuto with a valid body should return 201 (Created)', async () => {
    const response = await request(app)
      .post('/rifiuto')
      .set('x-access-token', token3)
      .send({
        URL_foto: 'https://www.google.com',
        posizione: {
          LAT: 45.123,
          LNG: 7.123,
          ALT: 123
        }
      });
    
      console.log(response.body);
    expect(response.statusCode).toBe(201);
  });
});

describe('GET /rifiuto/info/:id', () => {
  test('GET /rifiuto/info/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/rifiuto/info/63adfd7f72c887357ffce28e');

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    id: '63b1a4bef24bcf19150d3d3d',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('GET /rifiuto/info/:id with no id should return 404 (no id provided)', async () => {
    const response = await request(app)
      .get('/rifiuto/info/')
      .set('x-access-token', token);
      
    expect(response.statusCode).toBe(404);
  });

  test('GET /rifiuto/info/:id with a valid id should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/rifiuto/info/63adfd7f72c887357ffce28e')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(200);
  });
});

describe('GET /rifiuto/tocollect', () => {
  test('GET /rifiuto/tocollect with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/rifiuto/tocollect');

    expect(response.statusCode).toBe(400);
  });
  // create a valid token
  var payload = {
    id: '63b1a4bef24bcf19170d3a2d',
    nome_organizzazione: "burger king"
  };
  var token = jwt.sign(payload, process.env.SUPER_SECRET);

  test('GET /rifiuto/tocollect with a robot that doesn\'t exist should return 404 (robot not found)', async () => {
    const response = await request(app)
      .get('/rifiuto/tocollect')
      .set('x-access-token', token);

    expect(response.statusCode).toBe(404);
  });

  // create a valid token
  var payload1 = {
    id: '63ad9bd0b59ae608b3fa842a',
    nome_organizzazione: "burger king"
  };
  var token1 = jwt.sign(payload1, process.env.SUPER_SECRET);

  test('GET /rifiuto/tocollect with a robot that isn\'t assigned to any plan should return 404 (robot not assigned to any plan)', async () => {
    const response = await request(app)
      .get('/rifiuto/tocollect')
      .set('x-access-token', token1);
      
    expect(response.statusCode).toBe(404);
  });

  // create a valid token
  var payload2 = {
    id: '63b1a4bef24bcf19150d3d3d',
    nome_organizzazione: "burger king"
  };
  var token2 = jwt.sign(payload2, process.env.SUPER_SECRET);

  test('GET /rifiuto/tocollect with a valid token should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/rifiuto/tocollect')
      .set('x-access-token', token2);

    expect(response.statusCode).toBe(200);
  });
});

describe('GET /rifiuto/toclassify', () => {
  test('GET /rifiuto/toclassify with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .get('/rifiuto/toclassify');

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

  test('GET /rifiuto/toclassify with a valid token but no query parameters should return 400 (no query parameters provided)', async () => {
    const response = await request(app)
      .get('/rifiuto/toclassify')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('GET /rifiuto/toclassify with a valid token and a valid query parameter should return 200 (OK)', async () => {
    const response = await request(app)
      .get('/rifiuto/toclassify')
      .set('x-access-token', userToken)
      .query({ id_zona: 10 }).expect(200);
  });
});

describe('DELETE /rifiuto/:id', () => {
  test('DELETE /rifiuto/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .delete('/rifiuto/63adfd7f72c887357ffce28e');

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

  test('DELETE /rifiuto/:id with a valid token but no id should return 404 (no id provided)', async () => {
    const response = await request(app)
      .delete('/rifiuto/')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('DELETE /rifiuto/:id with a valid token and a valid id should return 204 (OK)', async () => {
    const response = await request(app)
      .delete('/rifiuto/63b310569a6916482a327449')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(204);
  });
});

describe('PATCH /rifiuto/:id', () => {
  test('PATCH /rifiuto/:id with no token should return 400 (no token provided)', async () => {
    const response = await request(app)
      .patch('/rifiuto/63adfd7f72c887357ffce28e');

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

  test('PATCH /rifiuto/:id with a valid token but no id should return 404 (no id provided)', async () => {
    const response = await request(app)
      .patch('/rifiuto/')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(404);
  });

  test('PATCH /rifiuto/:id with a valid token and a valid id but no body should return 400 (no body provided)', async () => {
    const response = await request(app)
      .patch('/rifiuto/63ae221072c887357ffce290')
      .set('x-access-token', userToken);

    expect(response.statusCode).toBe(400);
  });

  test('PATCH /rifiuto/:id with a valid token and a valid id and a valid body should return 200 (OK)', async () => {
    const response = await request(app)
      .patch('/rifiuto/63ae221072c887357ffce290')
      .set('x-access-token', userToken)
      .send({ classificazione: "Non riconosciuto" });

    expect(response.statusCode).toBe(200);
  });
});