import Link from 'next/link';

export default async function FeedPage() {
  const res = await fetch('http://localhost:3000/api/books', {
    cache: 'no-store'
  });

  const books = await res.json();

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
        {books.length === 0 ? (
          <li>No books found in the feed.</li>
        ) : (
          books.map((book) => (
            <li className="card" key={book._id}>
              <img src={book.image_url} alt="Book cover" />
              <h2>{book.title}</h2>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Description:</strong> {book.description}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Rating:</strong> {book.rating} / 5</p>
              <Link href={`/books/${book.book_id}`}>View Details</Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
