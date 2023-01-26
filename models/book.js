const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  _id: { type: String, required: true, unqiue: true },
  title: { type: String, required: true, unqiue: false },
  comments: { type: Array, required: true, unqiue: false },
  commentcount: { type: Number, required: true, unqiue: false },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
