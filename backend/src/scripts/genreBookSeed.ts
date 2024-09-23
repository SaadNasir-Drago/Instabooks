import { Genre, jsonBook } from "../types";
import { query } from "../database";
import { cleanBooksArray } from "./likeSeed";



async function getRandomBookIdFromDatabase(): Promise<number> {
  const queryText = `
    SELECT book_id FROM books
    ORDER BY RANDOM()
    LIMIT 1
  `;
  
  try {
    const result = await query(queryText);
    if (result.rows.length === 0) {
      throw new Error("No books found in the database.");
    }
    return result.rows[0].book_id;
  } catch (error) {
    console.error("Error fetching random book_id:", error);
    throw error;
  }
}

async function getRandomGenreIdFromDatabase(): Promise<number> {
  const queryText = `
    SELECT genre_id FROM genres
    ORDER BY RANDOM()
    LIMIT 1
  `;
  
  try {
    const result = await query(queryText);
    if (result.rows.length === 0) {
      throw new Error("No genres found in the database.");
    }
    return result.rows[0].genre_id;
  } catch (error) {
    console.error("Error fetching random genre_id:", error);
    throw error;
  }
}

export const seedGenreBooks = async (books: jsonBook[], genres: Genre[]) => {
  const booksArray = cleanBooksArray(books);

  // Check if there are valid books before proceeding
  if (booksArray.length === 0) {
    console.warn("No valid books to seed.");
    return;
  }

  for (const bookData of booksArray) {
    try {
      const bookId = await getRandomBookIdFromDatabase();
      const genreId = await getRandomGenreIdFromDatabase();

      // Skip if bookId or genreId is invalid
      if (!bookId || !genreId) {
        console.warn(`Skipping invalid book or genre: bookId=${bookId}, genreId=${genreId}`);
        continue;
      }

      const queryText = `
        INSERT INTO genre_books (
          book_id, genre_id
        ) VALUES (
          $1, $2
        )
      `;

      const values = [bookId, genreId];

      await query(queryText, values);
    
    } catch (error) {
      console.error(`Error inserting genre_book for book ID ${bookData.book_id}:`, error);
    }
  }
  console.log("GenreBook data inserted successfully");
};