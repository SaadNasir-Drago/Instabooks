import { jsonBook, User } from "../types";
import { query } from "../database";


// Function to check if a string contains only ASCII characters
const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};

// Function to clean and format data
const cleanBookData = (book: jsonBook)  => {
  return {
    book_id: book.bookId,
    title: isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
    rating: book.rating || null,
    pages: parseInt(book.pages) || null,
    publishDate: book.publishDate || null,
    numRatings: parseInt(book.numRatings) || null,
    coverImg: book.coverImg || null,
    price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
    author: isAscii(book.author) && book.author?.length ? book.author?.trim() : null, // Remove any extra spaces or line breaks
    description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
    publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks

  };
};

// Function to insert data into PostgreSQL
export const seedBooks = async (books: any[], user: User[]) => {
  let i = 0;
  for (const bookData of books) {
    
    const cleanedBook = cleanBookData(bookData);
    
    try {
      const queryText = `
        INSERT INTO books (
          book_id, title, rating, pages, publish_date, num_ratings, cover_img, price, author, description, publisher, user_id
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
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
        user[i].user_id //insert foreign key serially from users table
      ];

      await query(queryText, values);
      i++;
    } catch (error) {
      console.error(
        `Error inserting book with ID ${cleanedBook.book_id}:`
      );
    }
  }
  console.log("Data inserted successfully");
};
