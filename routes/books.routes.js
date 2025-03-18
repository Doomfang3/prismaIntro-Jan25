const express = require('express')
const router = express.Router()

const prisma = require('../db/index')

//  POST /api/books  -  Creates a new book
router.post('/', async (req, res, next) => {
  const { title, year, summary, quantity, genre, authorId } = req.body

  const newBookData = {
    title,
    year,
    summary,
    quantity,
    genre,
    authorId,
  }

  try {
    const newBook = await prisma.book.create({ data: newBookData })
    console.log('New book created', newBook)
    res.status(201).json(newBook)
  } catch (error) {
    next(error)
  }
})

//  GET /api/books -  Retrieves all of the books
router.get('/', async (req, res, next) => {
  try {
    const allBooks = await prisma.book.findMany({
      include: { author: true },
      omit: { authorId: true },
    })
    res.json(allBooks)
  } catch (error) {
    next(error)
  }
})

//  GET /api/books/:bookId -  Retrieves a specific book by id
router.get('/:bookId', async (req, res, next) => {
  const { bookId } = req.params

  try {
    const oneBook = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: true },
      omit: { authorId: true },
    })
    if (!oneBook) {
      res.status(404).json({ message: 'Book not found' })
    } else {
      res.json(oneBook)
    }
  } catch (error) {
    next(error)
  }
})

// PUT  /api/books/:bookId  -  Updates a specific book by id
router.put('/:bookId', (req, res, next) => {
  const { bookId } = req.params

  const { title, year, summary, quantity, genre, authorId } = req.body

  const newBookDetails = {
    title,
    year,
    summary,
    quantity,
    genre,
    authorId,
  }

  prisma.book
    .update({ where: { id: bookId }, data: newBookDetails })
    .then(updatedBook => {
      res.json(updatedBook)
    })
    .catch(err => {
      console.log('Error updating a book', err)
      res.status(500).json({ message: 'Error updating a book' })
    })
})

// DELETE  /api/books/:bookId  -  Deletes a specific book by id
router.delete('/:bookId', (req, res, next) => {
  const { bookId } = req.params

  prisma.book
    .delete({ where: { id: bookId } })
    .then(() => {
      res.json({ message: `Book with id ${bookId} was deleted successfully` })
    })
    .catch(err => {
      console.log('Error deleting a book', err)
      res.status(500).json({ message: 'Error deleting a book' })
    })
})

module.exports = router
