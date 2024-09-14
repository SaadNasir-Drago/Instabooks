import * as bookModel from '../models/bookModel';
import { Book } from '../types'

export const getAllBooks = () => bookModel.getAllBooks();

export const getBookById = (id: number) => bookModel.getBookById(id);

export const createBook = (book: Book) => bookModel.createBook(book);

export const updateBook = (id: number, book: Book) => bookModel.updateBook(id, book);

export const deleteBook = (id: number) => bookModel.deleteBook(id);
