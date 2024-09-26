import { Request, Response } from "express";
import * as bookModel from "../models/bookModel";


export const getBooks = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 16;
  const search = (req.query.search as string) || "";
  
  const offset = (page - 1) * limit;
  const sort = req.query.sort as string;
  const genre = parseInt(req.query.genre as string);

  try {
    const allbooks = await bookModel.getBooks(
      limit,
      offset,
      search,
      sort,
      genre
    );

    const totalPages = Math.ceil(allbooks.totalBooks / limit);

    res.json({
      books: allbooks.books,
      totalPages,
    });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await bookModel.getBookById(parseInt(id, 10));
    if (book) {
      res.json(book);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    console.log(req.body)
    const imageFile = req.file; // Get the uploaded file from multer

    // If an image was uploaded, store its filename in bookData
    if (imageFile) {
      req.body.cover_img = imageFile.filename; // Save the image filename to bookData
    }

    await bookModel.createBook(req.body);
    res.status(201).json({message: "Book added successfully"});
  } catch (error) {
    res.status(500).send("Error adding books");
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookModel.updateBook(parseInt(id, 10), req.body);
    res.status(200).send("Book updated successfully");
  } catch (error) {
    res.status(500).send("Error updating books");
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await bookModel.deleteBook(parseInt(id, 10));
    res.status(200).send("Book deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting books");
  }
};

export const likeDislikeBook = async (req: Request, res: Response) => {
  try {
    const result = await bookModel.likeDislikeBook(req.body);

    if (!result.success) {
      return res.status(400).json({ success: result.success, message: result.message });
    }

    res.status(201).json({ success: result.success, message: "Book liked successfully" });
  } catch (error) {
    console.error("Error in likeDislikeBook controller:", error);
    res.status(500).send("Error liking the book");
  }
};

export const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await bookModel.getGenres();

    if (genres) {
      res.status(200).json(genres);
    } else {
      res.status(404).send("Genres not found");
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).send("Error fetching genres");
  }
};
