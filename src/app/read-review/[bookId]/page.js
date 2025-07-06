import mongoose from 'mongoose';
import { Book } from '../../../../model/Book';

export default async function BookDetails({ params }) {
  const { bookId } = await params;

  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/bibliodb';

  if (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(mongoUri);
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
      return <h1>Database connection failed</h1>;
    }
  }

  const book = await Book.findOne({ book_id: parseInt(bookId) }).lean();

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
            <p><strong>{review.reviewer}</strong> ({new Date(review.review_date).toLocaleDateString()})</p>
            <p>Rating: {review.review_rating}/5</p>
            <p>{review.review_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
