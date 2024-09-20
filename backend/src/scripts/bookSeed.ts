import { jsonBook, User } from "../types";
import { query } from "../database";

// Function to check if a string contains only ASCII characters
export const isAscii = (str: string | null): boolean => {
  if (!str) return true; // Treat null or undefined as valid
  return /^[\x00-\x7F]*$/.test(str);
};

// Function to clean and format data
export const cleanBookData = (book: jsonBook) => {
  return {
    book_id: book.bookId,
    title: isAscii(book.title) && book.title?.length ? book.title?.trim() : null,
    rating: book.rating ? parseFloat(book.rating) : null,
    pages: parseInt(book.pages) || 0,
    publishDate: new Date(book.publishDate) || null,
    numRatings: parseInt(book.numRatings) || null,
    coverImg: book.coverImg || null,
    price: parseFloat(book.price?.trim()) || null, // Remove any extra spaces or line breaks
    author: isAscii(book.author) && book.author?.length ? book.author?.trim() : null, // Remove any extra spaces or line breaks
    description: isAscii(book.description) ? book.description?.trim() : null, // Remove any extra spaces or line breaks
    publisher: isAscii(book.publisher) ? book.publisher?.trim() : null, // Remove any extra spaces or line breaks
  };
};

// Function to get a random user from the array
const getRandomUserId = (users: User[]): number => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].user_id;
};

// Function to insert data into PostgreSQL
export const seedBooks = async (books: jsonBook[], user: User[]) => {
 
  // let i = 0;
  for (const bookData of books) {
    const cleanedBook = cleanBookData(bookData);
    if (
      cleanedBook.coverImg === null ||
      // cleanedBook.author === null ||
      // cleanedBook.title === null ||
      cleanedBook.book_id === null 
      // || i >= user.length
    ) {
      continue;
    }

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
        getRandomUserId(user), // Insert a random user_id
        //insert foreign key serially from users table
      ];

      await query(queryText, values);
      // i++;
    } catch (error) {
      console.error(`Error inserting book with ID ${cleanedBook.book_id}:`, error);
    }
  }
  console.log("Book Data inserted successfully");
};
