const { Book } = require('../../model/Book');

async function calculateAvgRating(bookId) {
  const id = typeof bookId === 'string' ? parseInt(bookId, 10) : bookId;
  const book = await Book.findOne({ book_id: id }).lean();

  if (!book || !Array.isArray(book.reviews) || book.reviews.length === 0) {
    return 0;
  }

  const total = book.reviews.reduce((sum, r) => sum + Number(r.review_rating), 0);
  return total / book.reviews.length;
}

module.exports = { calculateAvgRating };
