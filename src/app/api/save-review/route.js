import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const name = formData.get("name");
  const rating = formData.get("rating");
  const review = formData.get("review");
  const bookId = formData.get("bookId"); 

  const filePath = path.join(process.cwd(), 'src/data/library.json');
  const fileData = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(fileData);

  const book = books.find((b) => b.book_id.toString() === bookId);

  if (!book) {
    return new Response(JSON.stringify({ error: 'Book not found' }), {
      status: 404,
    });
  }

  const newReview = {
    review_id: Date.now(),
    reviewer: name,
    review_rating: rating,
    review_text: review,
    review_date: new Date().toISOString().split('T')[0],
  };

  if (!book.reviews) {
    book.reviews = [];
  }

  book.reviews.push(newReview);

  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/thanks?" + new URLSearchParams({ name, rating, review, bookId }),
    },
  });  
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'src/data/library.json');
  
  try {
    const books = fs.readFileSync(filePath, 'utf8');
    return new Response(books, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}