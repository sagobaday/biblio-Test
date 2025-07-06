const { Book } = require('../../model/Book');

async function findById(id) {
  return Book.findById(id);
}

module.exports = { findById };
