import { Book, Genre, User } from "../types";
import { query } from "../database";


// Function to insert GenreBook data into PostgreSQL
export const seedGenreBooks = async ( books: Book[], genres: Genre[]) => {
  let i = 0;
  for (const bookData of books) {

    if (i >= genres.length || i >= books.length) {
      console.error("Index out of range for users or books array.");
      break;
    }

    try {

      const queryText = `
        INSERT INTO genre_books (
         book_id, genre_id
        ) VALUES (
          $1, $2
        )
      `;

      const values = [
        books[i].book_id,
        genres[i].genre_id  // Reference user_id from users array
      ];

      await query(queryText, values);
      i++;
    } catch (error) {
      console.error(`Error inserting genre_book with book ID ${books[i].book_id}:`, error);
    }
  }
  console.log("GenreBook data inserted successfully");
};

