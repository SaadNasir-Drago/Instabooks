import { Book } from "../types";
import { query } from "../database";

// Function to clean and format data
const cleanBookData = (book: any): Book => {
  return {
    book_id: book.bookId,
    title: book.title || null,
    rating: book.rating || null,
    pages: parseInt(book.pages) || null,
    publishDate: book.publishDate || null,
    numRatings: parseInt(book.numRatings) || null,
    coverImg: book.coverImg || null,
    price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
    author: book.author?.trim() || null, // Remove any extra spaces or line breaks
    description: book.description?.trim() || null, // Remove any extra spaces or line breaks
    publisher: book.publisher?.trim() || null, // Remove any extra spaces or line breaks
  };
};

// Function to insert data into PostgreSQL
export const seedBooks = async (books: any[]) => {

  try {

    for (const bookData of books) {
      const cleanedBook = cleanBookData(bookData);

      const queryText = `
        INSERT INTO books (
          book_id, title, rating, pages, publish_date, num_ratings, cover_img, price, author, description, publisher
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
        )
        ON CONFLICT (book_id) DO NOTHING;
      `;

      const values = [
        cleanedBook.book_id,
        cleanedBook.title,
        cleanedBook.rating,
        cleanedBook.pages,
        cleanedBook.publishDate,
        cleanedBook.numRatings,
        cleanedBook.coverImg,
        cleanedBook.price,
        cleanedBook.author,
        cleanedBook.description,
        cleanedBook.publisher,
      ];

      await query(queryText, values);
    }
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  } 
};