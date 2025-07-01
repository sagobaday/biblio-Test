import Image from 'next/image';

export default async function BookDetail({ params }) {
  const { id } = params;

  const res = await fetch(`http://localhost:3000/api/books/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) {
    console.error('Failed to fetch book:', res.status);
    return <div>Book not found</div>;
  }

  const book = await res.json();

  if (!book || book.error) {
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
