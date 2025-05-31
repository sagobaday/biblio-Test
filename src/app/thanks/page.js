export default function ThanksPage({ searchParams }) {
    const { name, rating, review } = searchParams;
    return (
      <div className="container">
        <h1>Thank you, {name}!</h1>
        <p>You gave a rating of: {rating} stars</p>
        <p>Your review:</p>
        <blockquote>{review}</blockquote>
        <p>
          <a href="/reviews" style={{
            padding: '0.5em 1em',
            backgroundColor: '#1969d2',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            See all reviews
          </a>
        </p>
      </div>
    );
}