const mongoose = require('mongoose');
const { Book } = require('../../model/Book');
const fs = require('fs');
const path = require('path');

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/bibliodb');

  const filePath = path.join(__dirname, '../../src/data/library.json');
  const data = fs.readFileSync(filePath, 'utf8');
  const books = JSON.parse(data);

  await Book.insertMany(books);

  await mongoose.disconnect();
}

seed().catch(err => console.error(err));
