import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Book } from '../../../../../model/Book';

export async function GET(_, { params }) {
  const { id } = params;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect('mongodb://localhost:27017/bibliodb');
  }

  try {
    const book = await Book.findOne({ book_id: parseInt(id) }).lean();

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Failed to load book' }, { status: 500 });
  }
}
