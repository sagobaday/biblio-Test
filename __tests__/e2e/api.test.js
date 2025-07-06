const request = require('supertest');
const { setupTestApp, teardown } = require('../../test-helpers/testServer');

let app;
let Book;
let ReadingListItem;
let SwapRequest;
let emailService;
let mongoServer;

afterEach(async () => {
  if (mongoServer) {
    await teardown({ mongoServer });
    mongoServer = null;
  }
});

/** Test 1: List books endpoint */
test('List books endpoint', async () => {
  ({ app, mongoServer, Book } = await setupTestApp());
  await Book.insertMany([
    { title: 'B1', author: 'A', tags: ['scifi'] },
    { title: 'B2', author: 'A', tags: ['scifi'] },
    { title: 'B3', author: 'A', tags: ['scifi'] },
    { title: 'B4', author: 'A', tags: ['scifi'] },
    { title: 'B5', author: 'A', tags: ['scifi'] },
  ]);

  const res = await request(app)
    .get('/api/books')
    .query({ tag: 'scifi', page: 1, limit: 2 });

  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
  expect(res.headers['x-total-count']).toBe('5');
  res.body.forEach((b) => {
    expect(b).toHaveProperty('_id');
    expect(b).toHaveProperty('title');
    expect(b).toHaveProperty('author');
    expect(b).toHaveProperty('tags');
  });
});

/** Test 2: Create review endpoint */
test('Create review endpoint', async () => {
  ({ app, mongoServer, Book } = await setupTestApp());
  const book = await Book.create({ title: 'Book', author: 'A', tags: [] });

  const res = await request(app)
    .post('/api/reviews')
    .set('Cookie', 'session=valid')
    .send({ bookId: book._id, rating: 5, text: 'Great' });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ bookId: book._id.toString(), rating: 5, text: 'Great' });
  expect(res.body).toHaveProperty('_id');

  const updated = await Book.findById(book._id);
  expect(updated.averageRating).toBe(5);
});

/** Test 3: Reject unauthenticated review */
test('Reject unauthenticated review', async () => {
  ({ app, mongoServer, Book } = await setupTestApp());
  const book = await Book.create({ title: 'Book', author: 'A', tags: [] });
  const res = await request(app)
    .post('/api/reviews')
    .send({ bookId: book._id, rating: 5, text: 'Great' });
  expect(res.status).toBe(401);
  expect(res.body).toEqual({ error: 'UNAUTHENTICATED' });
});

/** Test 4: Update reading-list item */
test('Update reading-list item', async () => {
  ({ app, mongoServer, ReadingListItem } = await setupTestApp());
  const item = await ReadingListItem.create({ status: 'to-read' });
  const res = await request(app)
    .patch(`/api/reading-list/${item._id}`)
    .send({ status: 'finished' });

  expect(res.status).toBe(200);
  expect(res.body.status).toBe('finished');

  const fromDb = await ReadingListItem.findById(item._id);
  expect(fromDb.status).toBe('finished');
});

/** Test 5: Failure scenario – swap book when email service is down */
test('Swap book when email service is down', async () => {
  ({ app, mongoServer, Book, SwapRequest, emailService } = await setupTestApp());
  const book = await Book.create({ title: 'Book', author: 'A', tags: [] });
  emailService.fail();

  const res = await request(app)
    .post('/api/swap')
    .send({ bookId: book._id, requesterId: 'user1' });

  expect(res.status).toBe(502);
  const count = await SwapRequest.countDocuments();
  expect(count).toBe(0);
});
