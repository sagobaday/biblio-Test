'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReviewFormPage() {
  const { bookId } = useParams();
  const [rating, setRating] = useState(0);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <h2>Write a Review</h2>

        <form action="/api/save-review" method="POST" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input type="hidden" name="bookId" value={bookId} />
          <input type="hidden" name="rating" value={rating} />

          <label htmlFor="name" style={{ alignSelf: 'flex-start' }}>Name:</label>
          <input type="text" id="name" name="name" required style={{ width: '100%', marginBottom: '1rem' }} />

          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label style={{ display: 'block', textAlign: 'left' }}>Rate this book</label>
            <div className="stars" style={{ marginBottom: '1rem' }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`star${n <= rating ? ' selected' : ''}`}
                  style={{ cursor: 'pointer', fontSize: '2rem', color: n <= rating ? 'goldenrod' : 'lightgray' }}
                  onClick={() => setRating(n)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1rem', width: '100%' }}>
            <label htmlFor="review" style={{ display: 'block', textAlign: 'left' }}>Your Comment</label>
            <textarea id="review" name="review" rows="6" required style={{ width: '100%', marginTop: '0.5rem' }}></textarea>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
