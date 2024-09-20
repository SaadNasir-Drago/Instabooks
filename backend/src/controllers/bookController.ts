import { Request, Response } from "express";
import * as bookModel from "../models/bookModel";

export const getBooks = async (req: Request, res: Response) => {

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 16;
  const offset = (page - 1) * limit;

  try {
    const totalBooks = await bookModel.getTotalBooks();

    // Fetch paginated books
    const books = await bookModel.getBooks(limit, offset);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalBooks / limit);

    // Send the books and pagination info
    res.json({
      books,
      totalPages,
    });
  } catch (error) {
    res.status(500).send('Error fetching books')
  }
}

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await bookModel.getBookById(parseInt(id, 10));
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found')
    }
  } catch (error) {
    res.status(500).send('Error fetching books');
  }
}

export const createBook = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    await bookModel.createBook(req.body)
    res.status(201).send('Book added successfully')
  } catch (error) {
    res.status(500).send('Error adding books')
  }
}

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookModel.updateBook(parseInt(id, 10), req.body)
    res.status(200).send('Book updated successfully');
  } catch (error) {
    res.status(500).send('Error updating books')
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookModel.deleteBook(parseInt(id, 10))
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting books')
  }
}

// export const likeBook = async (req: Request, res: Response) => {
//   try {
//     await bookModel.likeBook(req.body)
//     res.status(201).send('Book added successfully')
//   } catch (error) {
//     res.status(500).send('Error adding books')
//   }
// }