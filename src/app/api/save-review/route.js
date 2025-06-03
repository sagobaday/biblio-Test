import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const name = formData.get("name");
  const rating = formData.get("rating");
  const review = formData.get("review");
  const bookId = formData.get("bookId"); 

  const reviewsPath = path.join(process.cwd(), 'public/reviews.json');
  let reviews = [];

  try {
    reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  } catch {}

  reviews.push({ 
    name, 
    rating, 
    review, 
    bookId, 
    timestamp: new Date() 
  });

  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/thanks?" + new URLSearchParams({ name, rating, review }),
    },
  });  
}

export async function GET() {
  const reviewsPath = path.join(process.cwd(), 'public/reviews.json');
  
  try {
    const reviews = fs.readFileSync(reviewsPath, 'utf8');
    return new Response(reviews, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}