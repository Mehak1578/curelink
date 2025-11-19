const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
let mongod;

beforeAll(async () => {
  // If MONGO_URI is provided in env, use it (user requested real MongoDB). Otherwise fall back to in-memory.
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Tests: connected to real MongoDB at', process.env.MONGO_URI);
  } else {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Tests: connected to in-memory MongoDB');
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
});

test('register and login flow', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', require('../src/routes/auth'));

  const user = { name: 'Test', email: 'test@example.com', password: 'password123' };
  const res1 = await request(app).post('/api/auth/register').send(user);
  expect(res1.statusCode).toBe(200);
  expect(res1.body).toHaveProperty('token');

  const res2 = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
  expect(res2.statusCode).toBe(200);
  expect(res2.body).toHaveProperty('token');
});
