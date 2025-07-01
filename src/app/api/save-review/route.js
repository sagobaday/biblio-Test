import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Book } from '../../../../model/Book';

export async function POST(req) {
  const formData = await req.formData();
  const name = formData.get("name");
  const rating = formData.get("rating");
  const review = formData.get("review");
  const bookId = formData.get("bookId"); 

    await mongoose.connect('mongodb://localhost:27017/bibliodb');

    const book = await Book.findOne({ book_id: parseInt(bookId) });
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const newReview = {
    review_id: Date.now(),
    reviewer: name,
    review_rating: rating,
    review_text: review,
    review_date: new Date().toISOString().split('T')[0],
  };

  book.reviews.push(newReview);

  const total = book.reviews.reduce((sum, r) => sum + Number(r.review_rating), 0);
  book.rating = total / book.reviews.length;

  await book.save();

  const params = new URLSearchParams({ name, rating, review, bookId });

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/thanks?" + new URLSearchParams({ name, rating, review, bookId }),
    },
  });  
}