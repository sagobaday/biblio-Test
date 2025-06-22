const mongoose = require('mongoose');
const {Book} = require('../model/Book');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/test');

  const allBooks = await Book.find();
  console.log("All Books:", allBooks);

  const book = await Book.findOne({ title: "The Midnight Library" });
  console.log("Info about The Midnight Library", book)

  const topRated = await Book.find({ rating: { $gte: 4.5 } });
  console.log("Highly Rated Books:", topRated);

  const book02 = await Book.findOne({ title: "Pachinko" });
  const reviews = book02.reviews;

  await Book.updateOne(
    { title: "Pachinko" },
    {
      $push: {
        reviews: {
          review_id: 2,
          reviewer: "Your Name",
          review_text: "Really moving story!",
          review_date: new Date(),
          review_rating: 4,
        },
      },
    }
  );
  


  await mongoose.disconnect();
}

run();
