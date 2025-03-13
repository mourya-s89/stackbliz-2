const express = require('express');
const app = express();
app.use(express.json());

const books = require('./data.json');

app.post('/books', (req, res) => {
  const { book_id, title, author, genre, year, copies } = req.body;

  if (!book_id || !title || !author || !genre || !year || !copies) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const exists = books.find(book => book.book_id === book_id);
  if (exists) {
    return res.status(400).json({ msg: "Book ID already exists" });
  }

  const newBook = { book_id, title, author, genre, year, copies };
  books.push(newBook);
  res.status(201).send({msg:"Sucessfully"},newBook);
});

app.get('/books', (req, res) => {
  res.status(200).json(books);
});

app.get('/books/:id', (req, res) => {
  const book = books.find(book => book.book_id === req.params.id);
  if (!book) {
    return res.status(404).json({ msg: "Book not found" });
  }
  res.status(200).json(book);
});

app.put('/books/:id', (req, res) => {
  const book = books.find(book => book.book_id === req.params.id);
  if (!book) {
    return res.status(404).json({ msg: "Book not found" });
  }

  const { title, author, genre, year, copies } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (genre) book.genre = genre;
  if (year) book.year = year;
  if (copies) book.copies = copies;

  res.status(200).json(book);
});

app.delete('/books/:id', (req, res) => {
  const index = books.findIndex(book => book.book_id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ msg: "Book not found" });
  }

  books.splice(index, 1);
  res.status(200).json({ msg: "Book deleted successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});