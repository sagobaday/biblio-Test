const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  review_id: Number,
  reviewer: String,
  review_text: String,
  review_date: Date,
  review_rating: Number
});

const BookSchema = new mongoose.Schema({
  book_id: Number,
  title: String,
  author: String,
  image_url: String,
  description: String,
  genre: String,
  publication_year: Number,
  language: String,
  pages: Number,
  rating: Number,
  reviews: [ReviewSchema]
});

const UserSchema = new mongoose.Schema({
  name: String, 
  email: {type:String, unique: true},
  readingList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book'}]
});


module.exports = {
  Book: mongoose.models.Book || mongoose.model("Book", BookSchema),
  User: mongoose.models.User || mongoose.model("User", UserSchema),
  Review: mongoose.models.Review || mongoose.model("Review", ReviewSchema)
};