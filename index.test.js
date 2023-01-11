/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const jwt     = require('jsonwebtoken'); // used to create, sign, and verify tokens
const app     = require('./index');

test('app module should be defined', () => {
  return expect(app).toBeDefined();
});
