const bookRepo = require('../repositories/bookRepo');
const emailService = require('./emailService');

async function proposeSwap(bookId, requesterId) {
  const book = await bookRepo.findById(bookId);
  if (!book) {
    throw new Error('BOOK_NOT_FOUND');
  }
  if (book.status === 'swapped') {
    throw new Error('BOOK_UNAVAILABLE');
  }
  await emailService.send({ bookId, requesterId });
}

module.exports = { proposeSwap };
