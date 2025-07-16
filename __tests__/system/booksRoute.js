/**
 * @jest-environment node
 *
 * System‑level test for the “/api/books” Next .js (App Router) route.
 *
 * ❶ Spins up an **in‑memory MongoDB** (MongoMemoryServer) so every run has a
 *    fresh, isolated database.
 * ❷ Seeds fixture data through the *real* Mongoose model ➜ exercises the data
 *    layer exactly like production.
 * ❸ Boots a full **Next.js dev server** on a random port – the request travels
 *    through routing, middle‑wares, and serialisation just like it will in
 *    Docker / Vercel.
 * ❹ Uses native `fetch` (available in Node ≥ 18) to hit the HTTP endpoint and
 *    asserts on status, headers, and response body.
 *
 * Run with:  npm test  (see Jest script & config below)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Jest setup checklist (add these to package.json or pnpm / yarn equivalent):
 *   npm i -D jest @types/jest mongodb-memory-server mongoose next cross-env
 *         supertest
 *   # optional but recommended transformer so Jest understands Next’s ESM
 *   npm i -D babel-jest @babel/core @babel/preset-env
 *
 * // jest.config.js  (simplest working setup)
 *   module.exports = {
 *     testEnvironment: 'node',
 *     testTimeout: 45000,             // Mongo + Next can take a few sec first run
 *     transform: {
 *       '^.+\\.[jt]sx?$': 'babel-jest',
 *     },
 *   };
 *
 * // .babelrc  (if you don’t already have one)
 *   { "presets": ["@babel/preset-env"] }
 *
 * And in package.json scripts:
 *   "test": "cross-env NODE_OPTIONS=--experimental-vm-modules jest"
 *
 * That experimental flag lets Jest run ESM (Next) modules under Node ≥18/20.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const http = require('http');
const next = require('next');

// Mongoose model – adjust the relative path if your project structure differs
const { Book } = require('../../model/Book');

let mongoServer;   // MongoMemoryServer instance
let server;        // HTTP server wrapping Next.js
let port;          // Random free port chosen at runtime

/**
 * Global setup – runs once before all tests in this file.
 *
 * We: ① start MongoDB, ② connect Mongoose, ③ seed a book, ④ boot Next.
 */
beforeAll(async () => {
  // ① Spin up in‑memory MongoDB and connect
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;       // your app’s DB util probably reads this
  await mongoose.connect(uri);

  // ② Seed deterministic fixture data
  await Book.create({ book_id: 1, title: 'Book', author: 'A' });

  // ③ Boot a full Next.js (dev) server
  const nextApp = next({ dev: true, dir: '../../' });  // adjust `dir` if needed
  await nextApp.prepare();
  const handle = nextApp.getRequestHandler();

  server = http.createServer((req, res) => handle(req, res));
  await new Promise(resolve => server.listen(0, resolve));
  port = server.address().port;
}, 40_000); // Allow up to 40 s – Docker pulls can be slow on CI

/**
 * Global teardown – clean up DB + server after all tests.
 */
afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
  if (server) await new Promise(resolve => server.close(resolve));
});

/**
 * The actual system test – fetch the /api/books endpoint and expect the seeded
 * book back.
 */
test('GET /api/books returns seeded books', async () => {
  const response = await fetch(`http://localhost:${port}/api/books`);

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toMatch(/application\/json/);

  const data = await response.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data).toHaveLength(1);
  expect(data[0]).toMatchObject({ title: 'Book', author: 'A' });
});
