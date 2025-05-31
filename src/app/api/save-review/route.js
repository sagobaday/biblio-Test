import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const name = formData.get("name");
  const rating = formData.get("rating");
  const review = formData.get("review");

  const reviewsPath = path.join(process.cwd(), 'public/reviews.json');
  let reviews = [];

  try {
    reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  } catch {}

  reviews.push({ name, rating, review, timestamp: new Date() });
  fs.writeFileSync(reviewsPath, JSON.stringify(reviews, null, 2));

  return new Response(null, {
    status: 303,
    headers: {
      Location: "/thanks?" + new URLSearchParams({ name, rating, review }),
    },
  });  
}