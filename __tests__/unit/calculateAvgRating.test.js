/* 
CalculateAvgRating.test.js uses mockingoose to mock Mongoose queries 
and confirms that average rating calculations work for books with and without reviews.
 */

const mockingoose = require('mockingoose');
const { Book } = require('../../model/Book');
const { calculateAvgRating } = require('../../src/services/bookService');

afterEach(() => {
  mockingoose.resetAll();
});

test('book has three reviews', async () => {
  mockingoose(Book).toReturn(
    {
      book_id: 1,
      reviews: [
        { review_rating: 5 },
        { review_rating: 4 },
        { review_rating: 3 },
      ],
    },
    'findOne'
  );

  const avg = await calculateAvgRating(1);
  expect(avg).toBe(4);
});

test('book has zero reviews', async () => {
  mockingoose(Book).toReturn({ book_id: 2, reviews: [] }, 'findOne');
  const avg = await calculateAvgRating(2);
  expect(avg).toBe(0);
});
