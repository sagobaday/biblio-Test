/** @jest-environment node */
/// <reference types="jest" />

/**
 * System test for Next.js App Router `/api/books` route using dynamic import
 * to support ES modules in route files.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { Book } = require('../../model/Book');

jest.setTimeout(60000);
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

test('GET /api/books returns seeded books', async () => {
  // Seed fixture
  await Book.create({ book_id: 1, title: 'Book', author: 'A' });

  // Dynamically import the route module (ESM)
  const routeModule = await import('../../src/app/api/books/route.js');
  const res = await routeModule.GET();
  const data = await res.json();

  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toMatch(/application\/json/);
  expect(Array.isArray(data)).toBe(true);
  expect(data).toHaveLength(1);
  expect(data[0]).toMatchObject({ title: 'Book', author: 'A' });
});
