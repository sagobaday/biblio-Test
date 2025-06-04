import fs from 'fs';
import path from 'path';
import Image from 'next/image';

export default async function BookDetail({ params }) {
  const { id } = await params;

  const filePath = path.join(process.cwd(), 'src/data/library.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(data);

  const book = books.find((b) => b.book_id === parseInt(id));

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="container">
      <div className="left-side">
        <h1>{book.title}</h1>
        <h3>by {book.author}</h3>
        <p><strong>Genre:</strong> {book.genre}</p>
        <p><strong>Published:</strong> {book.publication_year} | {book.language} | {book.pages} pages</p>

        <h4>Description</h4>
        <p>{book.description}</p>
        <a href={`/read-review/${book.book_id}`}>
        <button>Reviews ({book.reviews.length})</button>
        </a>
        <p>
          Average Rating:{' '}
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i}>{i < Math.round(book.rating) ? '★' : '☆'}</span>
          ))}{' '}
          ({book.rating}/5)
        </p>
      </div>

      <div className="right-side">
        <Image src={book.image_url} alt={book.title} width={500} height={700} />
        <a href={`/write-review/${book.book_id}`}>
        <button>＋</button>
        </a>
      </div>
    </div>
  );
}
