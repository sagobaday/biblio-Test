import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Book } from '@/model/Book';

export async function POST(req, { params }) {
  const { bookId } = params;
  const { reviewer, text, rating } = await req.json();

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect('mongodb://localhost:27017/bibliodb');
  }

  const book = await Book.findOne({ book_id: parseInt(bookId) });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const newReview = {
    review_id: Date.now(),
    reviewer,
    review_text: text,
    review_date: new Date().toISOString().split('T')[0],
    rating: parseInt(rating)
  };

  if (!Array.isArray(book.reviews)) {
    book.reviews = [];
  }

  book.reviews.push(newReview);

  const total = book.reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  book.rating = total / book.reviews.length;

  await book.save();

  return NextResponse.json(newReview, { status: 201 });
}
