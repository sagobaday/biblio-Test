// src/app/read-review/[bookId]/page.js

import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'src/data/library.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(data);

  return books.map((book) => ({
    bookId: book.book_id.toString(),
  }));
}

export default function BookDetails({ params }) {
  const filePath = path.join(process.cwd(), 'src/data/library.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(data);
  const book = books.find((b) => b.book_id.toString() === params.bookId);

  if (!book) {
    return <h1>404 - Book Not Found</h1>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{book.title}</h1>
      <img src={book.image_url} alt={book.title} style={{ width: 200 }} />
      <p><strong>Author:</strong> {book.author}</p>
      <p>{book.description}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Rating:</strong> {book.rating} / 5</p>

      <h2>Reviews</h2>
      <ul>
        {book.reviews.map((review) => (
          <li key={review.review_id} style={{ marginBottom: 10 }}>
            <p><strong>{review.reviewer}</strong> ({review.review_date})</p>
            <p>Rating: {review.review_rating}/5</p>
            <p>{review.review_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
