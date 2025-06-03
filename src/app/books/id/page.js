import fs from 'fs';
import path from 'path';
import Image from 'next/image';

export default async function BookDetail({ params }) {
  const { id } = params;

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

        <button>Reviews ({book.reviews.length})</button>

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
        <button>＋</button>
      </div>

      <style jsx>{`
        .container {
          display: flex;
          gap: 40px;
          padding: 20px;
        }

        .left-side {
          flex: 1;
        }

        .right-side {
          flex: 1;
          position: relative;
        }

        .right-side button {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background-color: #1969d2;
          color: white;
          font-size: 2rem;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
        }

        button {
          padding: 8px 15px;
          background-color: #1969d2;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}
