import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Book } from '../../../../model/Book';

export async function GET() {
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect('mongodb://localhost:27017/bibliodb');
  }

  try {
    const books = await Book.find({})
      .select('book_id title author image_url description genre rating reviews')
      .exec();

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to load books' }, { status: 500 });
  }
}
