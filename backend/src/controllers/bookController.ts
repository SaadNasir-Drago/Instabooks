import { Request, Response } from "express";
import * as bookService from "../services/bookService";

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).send('Error fetching books')
  }
}

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await bookService.getBookById(parseInt(id, 10));
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
    await bookService.createBook(req.body)
    res.status(201).send('Book added successfully')
  } catch (error) {
    res.status(500).send('Error adding books')
  }
}

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookService.updateBook(parseInt(id, 10), req.body)
    res.status(200).send('Book updated successfully');
  } catch (error) {
    res.status(500).send('Error updating books')
  }
}

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookService.deleteBook(parseInt(id, 10))
    res.status(200).send('Book deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting books')
  }
}