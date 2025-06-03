
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function FeedPage() {
  const filePath = path.join(process.cwd(), 'src/data/library.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(data);

  return (
    <div>
      <h1>Recent Reviews</h1>
      <style>{`
        .grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          padding: 0;
          list-style: none;
        }
        .card {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          width: 300px;
        }
        .card img {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .card h2 {
          margin: 0 0 5px;
          font-size: 1.2rem;
        }
        .card p {
          margin: 4px 0;
        }
      `}</style>

      <ul className="grid">
        {books.map((book) => (
          <li className="card" key={book.book_id}>
            <img src={book.image_url} alt="Book cover" />
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Description:</strong> {book.description}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Rating:</strong> {book.rating} / 5</p>
            <a href={`/read-review/${book.book_id}`}>View Details</a>

          </li>
        ))}

      </ul>
    </div>
  );
}
