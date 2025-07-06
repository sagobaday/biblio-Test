/* 
A helper server (testServer.js) spins up a lightweight Express 
app connected to an in‑memory MongoDB instance. 

Each test can start a new server, populate data, and shut it down afterward.

This helper creates simple Mongoose models (Book, Review, etc.), 
wires up Express routes for listing books, posting reviews, updating reading‑list items, 
and handling swap requests. An in‑memory MongoDB (MongoMemoryServer) lets tests run without a real database. 
A small stub emailService is provided so swap requests can simulate failures.

 */


const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

async function setupTestApp() {
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    tags: [String],
    averageRating: { type: Number, default: 0 },
    status: { type: String, default: 'available' }
  });
  const ReviewSchema = new mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    rating: Number,
    text: String,
  });
  const ReadingListItemSchema = new mongoose.Schema({
    status: String,
  });
  const SwapRequestSchema = new mongoose.Schema({
    bookId: mongoose.Schema.Types.ObjectId,
    requesterId: String,
  });

  const Book = mongoose.model('Book', BookSchema);
  const Review = mongoose.model('Review', ReviewSchema);
  const ReadingListItem = mongoose.model('ReadingListItem', ReadingListItemSchema);
  const SwapRequest = mongoose.model('SwapRequest', SwapRequestSchema);

  const app = express();
  app.use(express.json());

  app.get('/api/books', async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const tag = req.query.tag;
    const query = tag ? { tags: tag } : {};

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    res.set('X-Total-Count', String(total));
    res.json(
      books.map((b) => ({
        _id: b._id,
        title: b.title,
        author: b.author,
        tags: b.tags,
      }))
    );
  });

  app.post('/api/reviews', async (req, res) => {
    if (!req.headers.cookie) {
      return res.status(401).json({ error: 'UNAUTHENTICATED' });
    }
    const { bookId, rating, text } = req.body;
    const review = await Review.create({ bookId, rating, text });
    const agg = await Review.aggregate([
      { $match: { bookId: review.bookId } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const avg = agg[0] ? agg[0].avg : 0;
    await Book.findByIdAndUpdate(bookId, { averageRating: avg });
    res.status(201).json({ _id: review._id, bookId, rating, text });
  });

  app.patch('/api/reading-list/:id', async (req, res) => {
    const item = await ReadingListItem.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!item) return res.status(404).end();
    res.json(item);
  });

  let emailFail = false;
  const emailService = {
    send: jest.fn(() => {
      if (emailFail) {
        return Promise.reject(new Error('EMAIL_DOWN'));
      }
      return Promise.resolve();
    }),
    fail() {
      emailFail = true;
    },
    reset() {
      emailFail = false;
      emailService.send.mockClear();
    },
  };

  app.post('/api/swap', async (req, res) => {
    const { bookId, requesterId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.status === 'swapped') {
      return res.status(400).json({ error: 'BOOK_UNAVAILABLE' });
    }
    try {
      await emailService.send({ bookId, requesterId });
    } catch (err) {
      return res.status(502).json({ error: 'BAD_GATEWAY' });
    }
    await SwapRequest.create({ bookId, requesterId });
    res.status(201).json({ success: true });
  });

  return {
    app,
    mongoServer,
    Book,
    Review,
    ReadingListItem,
    SwapRequest,
    emailService,
  };
}

async function teardown({ mongoServer }) {
  await mongoose.disconnect();
  // Clear model cache so subsequent tests can re-register schemas
  mongoose.models = {};
  mongoose.connection.models = {};
  if (mongoServer) {
    await mongoServer.stop();
  }
}

module.exports = { setupTestApp, teardown };
